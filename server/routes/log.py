#
# yo!log
#

import gzip
import json
import logging

from fastapi import APIRouter, Request, Response

from opentelemetry.proto.collector.logs.v1.logs_service_pb2 import (
    ExportLogsServiceRequest,
    ExportLogsServiceResponse,
)

from adapters.adapt_log import adapt_log

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post('/v1/logs')
async def log_otlp(request: Request):
    """
    Ingest OTLP logs
    """
    # OTLP clients often use gzip

    body = await request.body()

    if request.headers.get('content-encoding') == 'gzip':
        body = gzip.decompress(body)

    req = ExportLogsServiceRequest()
    req.ParseFromString(body)

    # Logs are deeply nested. The protobuf structure is:
    # ExportLogsServiceRequest
    # +- resource_logs(repeated)
    #    +- resource(service attributes)
    #    \- scope_logs(repeated)
    #       +- scope(instrumentation library info)
    #       \- log_records(repeated)
    #           +- actual log entries
    #
    for resource_logs in req.resource_logs:
        for scope_logs in resource_logs.scope_logs:
            for record in scope_logs.log_records:
                entry = adapt_log(resource_logs, scope_logs, record)

                logger.info(json.dumps(entry.__dict__, indent=4))

    # Return protobuf response
    resp = ExportLogsServiceResponse()

    return Response(
        content=resp.SerializeToString(),
        media_type='application/x-protobuf',
    )
