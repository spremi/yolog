//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';

import {
  DEFAULT_LOG_COLUMNS,
  DEFAULT_LOG_COUNT,
  DEFAULT_LOG_LEVEL,
  DEFAULT_MENU_POSITION
} from '@base/app.defaults';
import { MenuPosition } from '@base/app.types';
import { AppSettings } from '@base/models/app-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly K_MENU = 'menu';
  private readonly K_LOG_LEVEL = 'level';
  private readonly K_LOG_COUNT = 'count';
  private readonly K_VIEW_COLUMNS = 'cols';

  private _menuPosition: WritableSignal<MenuPosition>;
  private _logLevel: WritableSignal<number>;
  private _logCount: WritableSignal<number>;
  private _viewColumns: WritableSignal<string[]>;

  // Derived signal - Combination of individual signals above.
  private readonly _appSettings: Signal<AppSettings>;

  constructor() {
    const menu = this.readStore<MenuPosition>(this.K_MENU, DEFAULT_MENU_POSITION);
    this._menuPosition = signal(menu);

    const logLevel = this.readStore<number>(this.K_LOG_LEVEL, DEFAULT_LOG_LEVEL);
    this._logLevel = signal(logLevel);

    const logCount = this.readStore<number>(this.K_LOG_COUNT, DEFAULT_LOG_COUNT);
    this._logCount = signal(logCount);

    const viewColumns = this.readStore<string[]>(this.K_VIEW_COLUMNS, DEFAULT_LOG_COLUMNS);
    this._viewColumns = signal(viewColumns);

    this._appSettings = computed<AppSettings>(() => ({
      menuPosition: this._menuPosition(),
      logLevel: this._logLevel(),
      logCount: this._logCount(),
      viewColumns: this._viewColumns(),
    }));
  }

  public getMenuPosition(): Signal<MenuPosition> {
    return this._menuPosition.asReadonly();
  }

  public toggleMenuPosition(): void {
    const nextPos = (this._menuPosition() === 'left' ? 'right' : 'left');

    this._menuPosition.set(nextPos);

    localStorage.setItem(this.K_MENU, JSON.stringify(nextPos));
  }

  public getLogLevel(): number {
    return this._logLevel();
  }

  public setLogLevel(level: number) {
    this._logLevel.set(level);

    localStorage.setItem(this.K_LOG_LEVEL, level.toString());
  }

  public getLogCount(): number {
    return this._logCount();
  }

  public setLogCount(count: number) {
    this._logCount.set(count);

    localStorage.setItem(this.K_LOG_COUNT, count.toString());
  }

  public getViewColumns(): string[] {
    return this._viewColumns();
  }

  public setViewColumns(columns: string[]) {
    this._viewColumns.set(columns);
    localStorage.setItem(this.K_VIEW_COLUMNS, JSON.stringify(columns));
  }

  public getAppSettings(): Signal<AppSettings> {
    return this._appSettings;
  }

  /**
   * Read value from local storage. Else, provide default.
   */
  private readStore<T>(key: string, defaultValue: T): T {
    const v = localStorage.getItem(key);

    if (v == null) {
      return defaultValue;
    }

    try {
      return JSON.parse(v);
    } catch (err) {
      console.log('readStore: ' + err);
    }
    return defaultValue;
  }
}
