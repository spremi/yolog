//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//

//
// Default values used across the application.
// All definitions are explicit - to avoid possible circular dependency.
//

/**
 * See: LOG_LEVELS
 */
export const DEFAULT_LOG_LEVEL = 3;   // INFO

/**
 * See: LOG_COLUMNS
 */
export const DEFAULT_LOG_COLUMNS = ['ts', 'message'];

/**
 * Number of logs to keep.
 */
export const DEFAULT_LOG_COUNT = 500;

/**
 * Keep menu position in original design as default.
 */
export const DEFAULT_MENU_POSITION = 'right';

/**
 * Timezone
 */
export const DEFAULT_TIMEZONE = 'UTC';

/**
 * Timestamp Mode.
 */
export const DEFAULT_TS_MODE = 'DATE_TIME';
