//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Injectable, signal, Signal } from '@angular/core';

import { MenuPosition } from '@base/app.types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _menuPosition = signal<MenuPosition>('right');

  constructor() { }

  public getMenuPosition(): Signal<MenuPosition> {
    return this._menuPosition.asReadonly();
  }

  public toggleMenuPosition(): void {
    const nextPos = (this._menuPosition() === 'left' ? 'right' : 'left');

    this._menuPosition.set(nextPos);
  }
}
