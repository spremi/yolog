#
# yo!log
#

from dataclasses import dataclass
from datetime import datetime


@dataclass
class LogEntry:
    """
    Schema for each log entry.

    Typically, OTLP uses protobuf.

    To make UI interaction simple, at cost of conversion while ingesting,
    defining simple object.
    """
    timestamp: str | None
    env: str | None
    level: str | None
    message: str
    host: str | None
    service: str | None
    module: str | None
    logger: str | None
    process: str | None
    thread: str | None
    trace_id: str | None
    span_id: str | None
    severity: int| None
    ip: str | None
    attributes: dict[str, any] | None
