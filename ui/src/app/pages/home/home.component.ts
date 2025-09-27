//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { DEFAULT_LOG_LEVEL } from '@base/app.defaults';
import { LOG_COLUMNS, LogColumn, ShowColumn } from '@base/models/log-column';
import { numericLogLevel } from '@base/models/log-level';

import { LogService } from '@base/services/log.service';

@Component({
  selector: 'sp-home',
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {

  logSvc = inject(LogService);

  logColumns = LOG_COLUMNS;

  /**
   * List of logs.
   */
  logs = this.logSvc.getLogs();

  /**
   * List of columns selected for viewing.
   */
  showColumns: LogColumn[] = this.selectColumns();

  /**
   * Get class name based on log level.
   */
  public classByLevel(level: string | undefined) : string {
    return 'log-' + (level ? numericLogLevel(level) : DEFAULT_LOG_LEVEL);
  }

  /**
   * Select columns to show.
   */
  private selectColumns(): LogColumn[] {
    return this.logColumns.filter(c => c.show !== ShowColumn.FALSE);
  }
}
