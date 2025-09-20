//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BodyComponent } from "@parts/body/body.component";
import { MenuComponent } from '@parts/menu/menu.component';

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
    '[class.menu-left]': `menuPosition === 'left'`
  }
})
export class AppComponent {
  @Input() menuPosition: 'left' | 'right' = 'right';

  title = 'yo!LOG';
}
