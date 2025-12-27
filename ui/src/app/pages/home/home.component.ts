//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';

import { DEFAULT_LOG_LEVEL } from '@base/app.defaults';
import { LogEntry } from '@base/app.types';
import { LOG_COLUMNS, LOG_KEYS, LogColumn, ShowColumn } from '@base/models/log-column';
import { numericLogLevel } from '@base/models/log-level';

import { LogService } from '@base/services/log.service';
import { StateService } from '@base/services/state.service';

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
  stateSvc = inject(StateService);

  logColumns = LOG_COLUMNS;

  /**
   * List of logs.
   */
  logs = this.logSvc.getLogs();

  /**
   * List of columns selected for viewing.
   */
  showColumns: LogColumn[];

  /**
   * Log selected by user.
   */
  selectedLog: LogEntry | null = null;

  constructor() {
    const initColumns = this.stateSvc.getViewColumns();

    this.showColumns = this.logColumns.filter(c => initColumns().includes(c.key));

    effect(() => {
      const updatedColumns = this.stateSvc.getViewColumns();

      this.showColumns = this.logColumns.filter(c => updatedColumns().includes(c.key));
    });
  }

  /**
   * Get class name based on log level.
   */
  public classByLevel(level: string | undefined) : string {
    return 'log-' + (level ? numericLogLevel(level) : DEFAULT_LOG_LEVEL);
  }

  /**
   * Select log.
   * Selecting same log again means de-select.
   */
  public selectLog(log: LogEntry | null): void {
    if (log !== null &&
        this.selectedLog !== null &&
        this.selectedLog[LOG_KEYS.UID] === log[LOG_KEYS.UID]) {
      this.selectedLog = null;
      return;
    }

    this.selectedLog = log;
  }
}
