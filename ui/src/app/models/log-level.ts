//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


/**
 * Encapsulates attributes of log level
 */
export interface LogLevel {
  key: string;
  label: string;
  value: number;
}

/**
 * Define levels used across the application.
 * Any other level is normalized to these values.
 */
export const LOG_LEVELS: LogLevel[] = [
  {
    key: 'trace',
    label: 'Trace',
    value: 1,
  },
  {
    key: 'debug',
    label: 'Debug',
    value: 2,
  },
  {
    key: 'info',
    label: 'Info',
    value: 3,
  },
  {
    key: 'warn',
    label: 'Warn',
    value: 4,
  },
  {
    key: 'error',
    label: 'Error',
    value: 5,
  },
  {
    key: 'fatal',
    label: 'Fatal',
    value: 6,
  }
];

/**
 * Returns nummeric value of specified log level.
 * (INFO is considered default)
 */
export const numericLogLevel = (arg?: string): number => {
  const k = arg?.toLowerCase() ?? 'info';

  const v = LOG_LEVELS.find(item => item.key === k)?.value;

  return v ?? 3;
};
