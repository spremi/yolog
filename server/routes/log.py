#
# yo!log
#

import gzip
import logging

from fastapi import APIRouter, Request, Response

from opentelemetry.proto.collector.logs.v1.logs_service_pb2 import (
    ExportLogsServiceRequest,
    ExportLogsServiceResponse,
)

from adapters.adapt_log import process_logs

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

    await process_logs(req.resource_logs)

    # Return protobuf response
    resp = ExportLogsServiceResponse()

    return Response(
        content=resp.SerializeToString(),
        media_type='application/x-protobuf',
    )
