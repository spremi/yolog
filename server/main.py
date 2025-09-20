#
# yo!log
#

import asyncio
import logging
import os
import uvicorn

from fastapi import FastAPI

from routes.log import router as router_log


PORT_OTLP_HTTP = int(os.getenv('PORT_OTLP_HTTP', 4318))
PORT_OTLP_GRPC = int(os.getenv('PORT_OTLP_GRPC', 4317))

PORT_UI = int(os.getenv('PORT_UI', 8000))

#
# Configure logger
#
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

#
# OTLP Receiver
#
log_receiver: FastAPI = FastAPI(title='yo!log OTLP Receiver')

log_receiver.include_router(router_log)

#
# LOG Provider
#
log_provider: FastAPI = FastAPI(title='yo!log LOG Provider')


@log_provider.get('/')
def provider_root() -> dict[str, str]:
    return {'status': 'ok'}


async def main() -> None:
    """
    Run 2 servers in parallel. Typical OTLP ports are 4137, 4138
    - LOG server: Ingests OTLP logs.
    - UI server : Provide logs to UI.
    """

    otlp_config = uvicorn.Config(log_receiver, host='0.0.0.0', port=PORT_OTLP_HTTP)
    otlp_server = uvicorn.Server(otlp_config)

    log_config = uvicorn.Config(log_provider, host='0.0.0.0', port=PORT_UI)
    log_server = uvicorn.Server(log_config)

    logger.info('Ready!')

    # Run both concurrently
    await asyncio.gather(
        otlp_server.serve(),
        log_server.serve()
    )


if __name__ == '__main__':
    asyncio.run(main())
