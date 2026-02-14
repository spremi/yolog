#
# yo!log
#

import logging
import grpc
import os

from opentelemetry.proto.collector.logs.v1 import logs_service_pb2_grpc

from protocol.service import LogsServiceAsync

PORT_OTLP_GRPC = int(os.getenv('PORT_OTLP_GRPC', 4317))

logger = logging.getLogger(__name__)


async def grpc_aio_server() -> None:
    """
    Starts an asynchronous gRPC server to receive OpenTelemetry logs.
    """

    server = grpc.aio.server()

    # Register 'LogsServiceAsync' as gRPC service handler.
    logs_service_pb2_grpc.add_LogsServiceServicer_to_server(LogsServiceAsync(), server)

    # Bind server to the specified port.
    server.add_insecure_port(f'0.0.0.0:{PORT_OTLP_GRPC}')

    await server.start()
    logger.info(f'Listening on gRPC port {PORT_OTLP_GRPC}.')

    try:
        await server.wait_for_termination()

    finally:
        await server.stop(grace=5)
        logger.info("gRPC server shutdown complete")
