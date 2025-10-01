//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { Subscription } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { v4 as uuidv4 } from 'uuid';

import { DEFAULT_LOG_LEVEL } from '@base/app.defaults';
import { LogEntry } from '@base/app.types';
import { getNormalizedKey, LOG_KEYS } from '@base/models/log-column';
import { CollectedValues, DynamicFilterKeys } from '@base/models/log-filters';

import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private stateSvc = inject(StateService);

  private ws$: WebSocketSubject<LogEntry>;

  private ws_uri = 'ws://localhost:8000/view/ws';

  private sub: Subscription;

  /**
   * Incoming logs - after normalization.
   */
  private _logs = signal<LogEntry[]>([]);


  constructor() {
    this.ws$ = webSocket<LogEntry>(this.ws_uri);

    this.sub = this.ws$.subscribe({
      next: (arg) => this.onNewLog(arg),
      error: (err) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket closed'),
    });
  }

  public getLogs(): Signal<LogEntry[]> {
    return this._logs.asReadonly();
  }

  /**
   * Encapsulates actions to be performed when new log is received.
   */
  private onNewLog(log: LogEntry) {
    if (this.stateSvc.isLogPaused()) {
      return;
    }

    const normalized = this.normalizeLog(log);

    this._logs.update((rows) => {
      // Add new log to top
      const newLogs = [normalized, ...rows];

      // Ensure we don't cross maximum log count.
      const maxCountSignal = this.stateSvc.getLogCount();
      const maxCount = maxCountSignal();

      return newLogs.length > maxCount ? newLogs.slice(0, maxCount) : newLogs;
    });

    this.updateDynamicFilters(normalized);
  }

  /**
   * Normalize log entry.
   */
  private normalizeLog(log: LogEntry): LogEntry {
    let normalized: LogEntry = {} as LogEntry;

    //
    // Normalize all keys.
    //
    for (const attr in log) {
      const normKey = getNormalizedKey(attr) || attr;

      normalized[normKey] = log[attr];
    }

    //
    // Normalize log level.
    //
    const levelKey = LOG_KEYS.LEVEL;

    normalized[levelKey] = (normalized[levelKey] ?? DEFAULT_LOG_LEVEL)
                              .toLocaleUpperCase();

    //
    // Add unique ID.
    //
    normalized[LOG_KEYS.UID] = uuidv4();

    return normalized;
  }

  /**
   * Extract values from log to be in dynamic filters.
   */
  private updateDynamicFilters(log: LogEntry): void {
    (Object.entries(CollectedValues) as [DynamicFilterKeys, WritableSignal<Set<string>>][])
      .forEach(([key, signal]) => {
        // Get value corresponding to the key
        const v = log[key];

        if (v) {
          // Mutate set only for new values to reduce signal propagation.
          signal.update(prev => {
            if (prev.has(v)) {
              return prev;
            }

            return new Set(prev).add(v);
          });
        }
      });
  }
}
