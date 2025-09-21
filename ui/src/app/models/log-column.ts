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
  TS: 'ts',
  ENV: 'env',
  LEVEL: 'level',
  MESSAGE: 'message',
  HOST: 'host',
  SERVICE: 'service',
  MODULE: 'module',
  LOGGER: 'logger',
  THREAD: 'thread',
  PROCESS: 'process',
  TRACE_ID: 'traceId',
  SPAN_ID: 'spanId',
  SEVERITY: 'severity',
  IP: 'ip',
  ATTRIBUTES: 'attributes',
} as const;

/**
 * Initialize column attributes.
 */
export const LOG_COLUMNS: LogColumn[] = [
  {
    key: LOG_KEYS.TS,
    label: 'Timestamp',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.ENV,
    label: 'Environment',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.LEVEL,
    label: 'Level',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.MESSAGE,
    label: 'Message',
    show: ShowColumn.ALWAYS,
  },
  {
    key: LOG_KEYS.HOST,
    label: 'Host',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.SERVICE,
    label: 'Service',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.MODULE,
    label: 'Module',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.LOGGER,
    label: 'Logger',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.THREAD,
    label: 'Thread',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.TRACE_ID,
    label: 'Trace ID',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.SPAN_ID,
    label: 'Span ID',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.SEVERITY,
    label: 'Severity',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.IP,
    label: 'IP',
    show: ShowColumn.FALSE,
  },
  {
    key: LOG_KEYS.ATTRIBUTES,
    label: 'Attributes',
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
