//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { SettingsService } from '@base/services/settings.service';
import { StateService } from '@base/services/state.service';

@Component({
  selector: 'sp-menu',
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass'
})
export class MenuComponent implements OnInit, OnDestroy {
  private SLIDE_DURATION_MS = 300;
  private IDLE_TIMEOUT_MS = 5000;

  private router = inject(Router);
  private settingSvc = inject(SettingsService);
  private stateSvc = inject(StateService);

  private routeSub: Subscription | null = null;

  activeMenu: string | null = null;

  activeRoute = '';
  logPaused = false;

  ngOnInit(): void {
    this.routeSub = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(ev => {
        this.activeRoute = ev.url;
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.routeSub = null;
  }

  /**
   * Navigate to specified route.
   */
  go(target: string): void {
    this.router.navigate([`/${target}`]);
  }

  /**
   * Toggle menu position
   */
  togglePosition(): void {
    this.settingSvc.toggleMenuPosition();
  }

  /**
   * Toggle logging.
   */
  toggleLogging(): void {
    this.stateSvc.toggleLogging();

    this.logPaused = this.stateSvc.isLogPaused();
  }
}
