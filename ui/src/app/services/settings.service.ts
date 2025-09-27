//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

import {
  DEFAULT_LOG_COUNT,
  DEFAULT_LOG_LEVEL,
  DEFAULT_MENU_POSITION
} from '@base/app.defaults';
import { MenuPosition } from '@base/app.types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly K_MENU = 'menu';
  private readonly K_LOG_LEVEL = 'level';
  private readonly K_LOG_COUNT = 'count';

  private _menuPosition: WritableSignal<MenuPosition>;
  private _logLevel: WritableSignal<number>;
  private _logCount: WritableSignal<number>;


  constructor() {
    const menu = this.readStore<MenuPosition>(this.K_MENU, DEFAULT_MENU_POSITION);
    this._menuPosition = signal(menu);

    const logLevel = this.readStore<number>(this.K_LOG_LEVEL, DEFAULT_LOG_LEVEL);
    this._logLevel = signal(logLevel);

    const logCount = this.readStore<number>(this.K_LOG_COUNT, DEFAULT_LOG_COUNT);
    this._logCount = signal(logCount);
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
