//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BodyComponent } from "@parts/body/body.component";
import { MenuComponent } from '@parts/menu/menu.component';
import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'sp-root',
  imports: [
    RouterOutlet,
    BodyComponent,
    MenuComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
  host: {
    '[class.menu-left]': `menuPosition() === 'left'`
  }
})
export class AppComponent {
  private settingsSvc = inject(SettingsService);

  readonly menuPosition = this.settingsSvc.getMenuPosition();

  title = 'yo!LOG';
}
