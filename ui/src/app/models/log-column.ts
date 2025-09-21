//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


/**
 * Defines visibility of column.
 */
export enum ShowColumn {
  FALSE = 0,
  TRUE = 1,
  ALWAYS = 2,
}

/**
 * Encapsulates attributes of a column in the log table.
 */
export interface LogColumn {
  key: string;
  label: string;
  show: ShowColumn;
}

/**
 * Define keys for log columns.
 * Make the objeect immutable and literal.
 */
export const LOG_KEYS = {
  UID: 'uid',     // Internal Unique ID for benefit of Angular rendering.
  TS: 'ts',
  ENV: 'env',
  LEVEL: 'level',
  MESSAGE: 'message',
  HOST: 'host',
  SERVICE: 'service',
  MODULE: 'module',
  LOGGER: 'logger',
  PROCESS: 'process',
  THREAD: 'thread',
  TRACE_ID: 'traceId',
  SPAN_ID: 'spanId',
  SEVERITY: 'severity',
  IP: 'ip',
  ATTRIBUTES: 'attributes',
} as const;


/**
 * Derive 'type' from union of LOG_KEY values.
 *
 */
type LogKey = typeof LOG_KEYS[keyof typeof LOG_KEYS];

/**
 * User friendly labels for the keys.
 * (Using strong types to ensure that structures are always in sync)
 */
export const LOG_LABELS: Record<LogKey, string> = {
  [LOG_KEYS.UID]: 'UID',
  [LOG_KEYS.TS]: 'Timestamp',
  [LOG_KEYS.ENV]: 'Environment',
  [LOG_KEYS.LEVEL]: 'Level',
  [LOG_KEYS.MESSAGE]: 'Message',
  [LOG_KEYS.HOST]: 'Host',
  [LOG_KEYS.SERVICE]: 'Service',
  [LOG_KEYS.MODULE]: 'Module',
  [LOG_KEYS.LOGGER]: 'Logger',
  [LOG_KEYS.PROCESS]: 'Process',
  [LOG_KEYS.THREAD]: 'Thread',
  [LOG_KEYS.TRACE_ID]: 'Trace ID',
  [LOG_KEYS.SPAN_ID]: 'Span ID',
  [LOG_KEYS.SEVERITY]: 'Severity',
  [LOG_KEYS.IP]: 'IP',
  [LOG_KEYS.ATTRIBUTES]: 'Attributes',
};

/**
 * Initialize column attributes.
 * Array enforces a sequence - necessary for consistent visualization.
 * UID is meant for internal object tracking. So, it is not included here.
 */
export const LOG_COLUMNS: LogColumn[] = [
  {
    key: LOG_KEYS.TS,
    label: LOG_LABELS[LOG_KEYS.TS],
    show: ShowColumn.TRUE,
  },
  {
    key: LOG_KEYS.ENV,
    label: LOG_LABELS[LOG_KEYS.ENV],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.LEVEL,
    label: LOG_LABELS[LOG_KEYS.LEVEL],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.MESSAGE,
    label: LOG_LABELS[LOG_KEYS.MESSAGE],
    show: ShowColumn.ALWAYS,
  },
  {
    key: LOG_KEYS.HOST,
    label: LOG_LABELS[LOG_KEYS.HOST],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.SERVICE,
    label: LOG_LABELS[LOG_KEYS.SERVICE],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.MODULE,
    label: LOG_LABELS[LOG_KEYS.MODULE],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.LOGGER,
    label: LOG_LABELS[LOG_KEYS.LOGGER],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.PROCESS,
    label: LOG_LABELS[LOG_KEYS.PROCESS],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.THREAD,
    label: LOG_LABELS[LOG_KEYS.THREAD],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.TRACE_ID,
    label: LOG_LABELS[LOG_KEYS.TRACE_ID],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.SPAN_ID,
    label: LOG_LABELS[LOG_KEYS.SPAN_ID],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.SEVERITY,
    label: LOG_LABELS[LOG_KEYS.SEVERITY],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.IP,
    label: LOG_LABELS[LOG_KEYS.IP],
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.ATTRIBUTES,
    label: LOG_LABELS[LOG_KEYS.ATTRIBUTES],
    show: ShowColumn.FALSE,
  },
];

/**
 * Mapper to normalize various incoming keys.
 */
export const LOG_KEYS_MAP = {
  'timestamp': LOG_KEYS.TS,
  'environment': LOG_KEYS.ENV,
  'text': LOG_KEYS.MESSAGE,
  'span_id': LOG_KEYS.SPAN_ID,
  'trace_id': LOG_KEYS.TRACE_ID,
  'thread_id': LOG_KEYS.THREAD,
  'process_id': LOG_KEYS.PROCESS,
  'logger_name': LOG_KEYS.LOGGER,
  'service_name': LOG_KEYS.SERVICE,
  'module_name': LOG_KEYS.MODULE,
  'severity_number': LOG_KEYS.SEVERITY,
  'hostname': LOG_KEYS.HOST,
  'host_name': LOG_KEYS.HOST,
  'ip_addr': LOG_KEYS.IP,
} as const;

/**
 * Defines a guard for converting arbitrary 'string' to key in LOG_MAPPER.
 */
function isLogMapperKey(key: string) : key is keyof typeof LOG_KEYS_MAP {
  return key in LOG_KEYS_MAP;
}

/**
 * Get normalized key - if it is found in LOG_MAPPER.
 */
export function getNormalizedKey(key: string) : string | undefined {
  if (isLogMapperKey(key)) {
    return LOG_KEYS_MAP[key];
  }

  return undefined;
}
