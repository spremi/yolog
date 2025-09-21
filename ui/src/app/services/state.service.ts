//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Injectable, signal } from '@angular/core';

/**
 * Encapsulates runtime state of the application.
 *
 * State is derived from persistent settings... but not preserved.
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  /**
   * Logs are paused?
   */
  private logsPaused = signal(false);

  constructor() { }

  /**
   * Is logging paused?
   */
  public isLogPaused(): boolean {
    return this.logsPaused();
  }

  /**
   * Toggle state of logging.
   */
  public toggleLogging(): void {
    const current = this.logsPaused();

    this.logsPaused.set(!current);
  }
}
