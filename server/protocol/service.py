#
# yo!log
#

from grpc.aio import ServicerContext
from opentelemetry.proto.collector.logs.v1 import logs_service_pb2_grpc, logs_service_pb2
from opentelemetry.proto.collector.logs.v1.logs_service_pb2 import ExportLogsServiceResponse, ExportLogsServiceRequest

from adapters.adapt_log import process_logs


class LogsServiceAsync(logs_service_pb2_grpc.LogsServiceServicer):
    """
    Asynchronous gRPC service for handling log export requests.

    It implements the LogsService gRPC interface and provides
    a method to receive and process log data asynchronously.
    """
    async def Export(self,
                     request: ExportLogsServiceRequest,
                     context: ServicerContext) -> ExportLogsServiceResponse:
        """
        Handles (asynchronously) incoming Export requests containing log entries
        and returns empty response indicating logs were successfully processed.
        """
        await process_logs(request.resource_logs)

        return logs_service_pb2.ExportLogsServiceResponse()
