#
# yo!log
#

import json
import logging

from datetime import datetime, timezone
from typing import Sequence

from opentelemetry.proto.logs.v1.logs_pb2 import LogRecord, ResourceLogs, ScopeLogs
from opentelemetry.proto.common.v1.common_pb2 import AnyValue

from models.log_entry import LogEntry
from state import log_queue, log_queue_lock

logger = logging.getLogger(__name__)


# In OTLP protobuf, attributes are defined as:
#
# message AnyValue {
#   oneof value {
#     string        string_value = 1;
#     bool          bool_value = 2;
#     int64         int_value = 3;
#     double        double_value = 4;
#     bytes         bytes_value = 5;
#     ArrayValue    array_value = 6;
#     KeyValueList  kvlist_value = 7;
#   }
# }
#
# Where:
#
# message ArrayValue {
#   repeated AnyValue values = 1;
# }
#
# message KeyValueList {
#   repeated KeyValue values = 1;
# }
#
# message KeyValue {
#   string key = 1;
#   AnyValue value = 2;
# }
#
# Keyword 'oneof' indicates that only one of these can be set at a time.
#
# In protobuf python bindings, 'WhichOneof(value)' returns name of the
# field that is set in specified 'oneof' group. Else it returns None.
#


def any_value_to_python(v: AnyValue) -> any:
    """
    Decodes protobuf values based on their type - as native python values.
    """

    kind = v.WhichOneof("value")
    if kind is None:
        return None

    value = getattr(v, kind)

    if kind == 'bytes_value':
        return value.hex()

    if kind == 'array_value':
        return [any_value_to_python(x) for x in value.values]

    if kind == 'kvlist_value':
        return {
            kv.key: any_value_to_python(kv.value) for kv in value.values
        }

    return value



def get_attr(record: LogRecord, key: str) -> any:
    """
    Extracts the value of a given attribute key from an OTLP LogRecord.
    """
    for kv in record.attributes:
        if kv.key == key:
            return any_value_to_python(kv.value)

    return None


def nanosecond_to_iso_datetime(ns: int) -> str:
    """
    Convert nanosecond value to date and time in ISO format.
    Python datatime object is not JSON serializable.
    (For now, assume timezone to be UTC)
    """

    return datetime.fromtimestamp(ns / 1_000_000_000, tz=timezone.utc).isoformat()


def adapt_log(
    resource_logs: ResourceLogs,
    scope_logs: ScopeLogs,
    record: LogRecord
) -> LogEntry:
    """
    Convert log (in protobuf) to simple structure.

    TODO: Extract the keys that we are interested in.
          Leave others as generic attributes.
    """

    # Timestamp
    ts_ns = record.time_unix_nano or record.observed_time_unix_nano
    log_ts = nanosecond_to_iso_datetime(ts_ns)

    # Message (body)
    log_message = any_value_to_python(record.body)
    log_message = str(log_message) if log_message is not None else ''

    # Level / severity
    log_level = (
            record.severity_text or
            get_attr(record, 'log.severity_text') or
            None
    )

    log_severity = (
            record.severity_number or
            get_attr(record, 'log.severity_number') or
            None
    )

    # Trace correlation
    log_trace_id = (
        record.trace_id.hex() if record.trace_id else
        get_attr(record, 'trace_id') or
        None
    )

    log_span_id = (
        record.span_id.hex() if record.trace_id else
        get_attr(record, 'span_id') or
        None
    )

    # Logger
    log_logger = (
        scope_logs.scope.name if scope_logs else None or
        get_attr(record, 'log.logger') or
        get_attr(record, 'logger.name') or
        None
    )

    # Module
    log_module = (
        get_attr(record, 'code.module') or
        None
    )

    # Thread
    log_thread = (
        get_attr(record, 'thread.name') or
        get_attr(record, 'thread.id') or
        None
    )

    # Attributes (merged, flat)
    attributes: dict[any, str] = {}

    # Resource attributes (service.name, etc.)
    for attr in resource_logs.resource.attributes:
        attributes[attr.key] = any_value_to_python(attr.value)

    # Scope attributes
    for attr in scope_logs.scope.attributes:
        attributes[attr.key] = any_value_to_python(attr.value)

    # Log attributes
    for attr in record.attributes:
        attributes[attr.key] = any_value_to_python(attr.value)

    if attributes:
        log_env = get_attr(record, 'deployment.environment')
        log_service = get_attr(record, 'service.name')
        log_process = get_attr(record, 'process.command')
        log_host = get_attr(record, 'host.name')
        log_ip = get_attr(record, 'host.ip')

    else:
        log_env = None
        log_service = None
        log_process = None
        log_host = None
        log_ip = None

    entry = LogEntry(
        timestamp=log_ts,
        env=log_env,
        level=log_level,
        message=log_message,
        logger=log_logger,
        module=log_module,
        process=log_process,
        thread=log_thread,
        trace_id=log_trace_id,
        span_id=log_span_id,
        severity=log_severity,
        service=log_service,
        host=log_host,
        ip=log_ip,
        attributes=attributes,
    )

    logger.debug(entry)

    return entry


async def process_logs(resource_logs: Sequence[ResourceLogs]) -> None:
    """
    Exported OpenTelemetry logs are deeply nested.
    The protobuf structure is:
        ExportLogsServiceRequest
            resource_logs(repeated
                resource(service attributes)
                scope_logs(repeated)
                    scope(instrumentation library info)
                    log_records(repeated)
                        actual log entries
    """
    for rl in resource_logs:
        for sl in rl.scope_logs:
            for lr in sl.log_records:
                logger.debug(f'Incoming log: {lr}')

                entry = adapt_log(rl, sl, lr)

                # logger.info(json.dumps(entry.__dict__, indent=4))

                async with log_queue_lock:
                    log_queue.append(entry)
