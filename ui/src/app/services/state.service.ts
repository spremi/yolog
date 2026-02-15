//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import {
  effect, inject, Injectable, Signal, signal, untracked, WritableSignal
} from '@angular/core';

import { MenuPosition, TsMode } from '@base/app.types';
import { AppSettings } from '@base/models/app-settings';

import { SettingsService } from './settings.service';

/**
 * Encapsulates runtime state of the application.
 *
 * State is derived from persistent settings... but not preserved.
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private settingSvc = inject(SettingsService);

  private _settings: Signal<AppSettings>;

  private _menuPosition: WritableSignal<MenuPosition>;
  private _logLevel: WritableSignal<number>;
  private _logCount: WritableSignal<number>;
  private _viewColumns: WritableSignal<string[]>;
  private _timeZone: WritableSignal<string>;
  private _tsMode: WritableSignal<TsMode>;

  /**
   * Logs are paused?
   */
  private logsPaused = signal(false);

  constructor() {
    this._settings = this.settingSvc.getAppSettings();

    const initial = this._settings();

    this._menuPosition = signal(initial.menuPosition);
    this._logLevel = signal(initial.logLevel);
    this._logCount = signal(initial.logCount);
    this._viewColumns = signal(initial.viewColumns);
    this._timeZone = signal(initial.timeZone);
    this._tsMode = signal(initial.tsMode);

    effect(() => {
      // Read the 'signal'.
      // This will become a dependency for effect.
      const update = this._settings();

      untracked(() => {
        // Signals here won't become dependencies for effect().
        this._menuPosition.set(update.menuPosition);
        this._logLevel.set(update.logLevel);
        this._logCount.set(update.logCount);
        this._viewColumns.set(update.viewColumns);
        this._timeZone.set(update.timeZone);
        this._tsMode = signal(update.tsMode);
      });
    });
  }

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

  public getMenuPosition(): Signal<MenuPosition> {
    return this._menuPosition.asReadonly();
  }

  public toggleMenuPosition(): void {
    const nextPos = (this._menuPosition() === 'left' ? 'right' : 'left');

    this._menuPosition.set(nextPos);
  }

  public getLogLevel(): Signal<number> {
    return this._logLevel.asReadonly();
  }

  public setLogLevel(level: number): void {
    this._logLevel.set(level);
  }

  public getLogCount(): Signal<number> {
    return this._logCount.asReadonly();
  }

  public setLogCount(count: number): void {
    this._logCount.set(count);
  }

  public getViewColumns(): Signal<string[]> {
    return this._viewColumns.asReadonly();
  }

  public setViewColumns(columns: string[]): void {
    this._viewColumns.set(columns);
  }

  public getTimeZone(): Signal<string> {
    return this._timeZone.asReadonly();
  }

  public setTimeZone(zone: string): void {
    this._timeZone.set(zone);
  }

  public getTsMode(): Signal<TsMode> {
    return this._tsMode.asReadonly();
  }

  public setTsMode(mode: TsMode): void {
    this._tsMode.set(mode);
  }
}
