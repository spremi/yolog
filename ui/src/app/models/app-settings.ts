//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//

import { MenuPosition } from '@base/app.types';

/**
 * Collection of all settings that are explicitly saved by the user.
 */
export interface AppSettings {
  /**
   * Position of menu bar.
   */
  menuPosition: MenuPosition;

  /**
   * Filter for log level.
   */
  logLevel: number;

  /**
   * Number of log lines to keep.
   */
  logCount: number;

  /**
   * Visible columns.
   */
  viewColumns: string[];
}
