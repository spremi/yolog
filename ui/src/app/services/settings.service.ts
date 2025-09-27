//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

import { DEFAULT_MENU_POSITION } from '@base/app.defaults';
import { MenuPosition } from '@base/app.types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly K_MENU = 'menu';

  private _menuPosition: WritableSignal<MenuPosition>;

  constructor() {
    const menu = this.readStore<MenuPosition>(this.K_MENU, DEFAULT_MENU_POSITION);
    this._menuPosition = signal(menu);
  }

  public getMenuPosition(): Signal<MenuPosition> {
    return this._menuPosition.asReadonly();
  }

  public toggleMenuPosition(): void {
    const nextPos = (this._menuPosition() === 'left' ? 'right' : 'left');

    this._menuPosition.set(nextPos);

    localStorage.setItem(this.K_MENU, JSON.stringify(nextPos));
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
