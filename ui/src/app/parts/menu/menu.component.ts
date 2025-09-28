//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, fromEvent, merge, of, Subscription, switchMap, timer } from 'rxjs';

import { MenuPosition } from '@base/app.types';
import { StateService } from '@base/services/state.service';
import { LOG_LEVELS } from '@base/models/log-level';
import { LOG_COLUMNS, ShowColumn } from '@base/models/log-column';

/**
 * Different states of menu panel - required during transitions.
 */
enum PanelState {
  CLOSED = 1,
  CLOSING = 10,
  OPEN = 2,
  OPENING = 20,
}

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
  private stateSvc = inject(StateService);

  private routeSub: Subscription | null = null;
  private idleSub: Subscription | null = null;

  readonly logLevels = LOG_LEVELS;
  readonly logColumns = LOG_COLUMNS;

  activeMenu: string | null = null;
  nextMenu: string | null = null;

  activeRoute = '';
  logPaused = false;

  panelState = PanelState.CLOSED;

  @ViewChild('panelRef') panelRef!: ElementRef<HTMLElement>;

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

    this.idleSub?.unsubscribe();
    this.idleSub = null;
  }

  /**
   * Navigate to specified route.
   */
  go(target: string): void {
    this.router.navigate([`/${target}`]);
  }

  /**
   * Get menu position.
   */
  getPosition(): MenuPosition {
    const pos = this.stateSvc.getMenuPosition();
    return pos();
  }

  /**
   * Toggle menu position
   */
  togglePosition(): void {
    // Temporarily disable animations
    const panel = this.panelRef.nativeElement;
    panel.classList.add('silent');

    this.stateSvc.toggleMenuPosition();

    // Enable animations again
    setTimeout(() => panel.classList.remove('silent'), 50);
  }

  /**
   * Toggle logging.
   */
  toggleLogging(): void {
    this.stateSvc.toggleLogging();

    this.logPaused = this.stateSvc.isLogPaused();
  }

  /**
   * Toggle panel - open/ close.
   */
  togglePanel(menu: string) {
    if (this.panelState === PanelState.OPENING ||
        this.panelState === PanelState.CLOSING) {
      // No action
      return;
    }

    if (this.activeMenu === menu) {
      // Same menu clicked.
      this.closeMenu();

      return;
    }

    if (this.panelState === PanelState.OPEN) {
      // Close current menu and save 'chosen' menu.
      this.nextMenu = menu;
      this.closeMenu();

      return;
    }

    // No active menu. Open 'chosen' menu.
    this.openMenu(menu);
  }

  /**
   * Get current log level.
   */
  getLogLevel(): number {
    const levels = this.stateSvc.getLogLevel();
    return levels();
  }

  /**
   * Set log level.
   */
  setLogLevel(level: number): void {
    this.stateSvc.setLogLevel(level);
  }

  /**
   * Is column always visible?
   */
  isColumnAlways(key: string): boolean {
    const column = LOG_COLUMNS.find((c) => c.key === key);
    if (column) {
      return column.show === ShowColumn.ALWAYS;
    }

    return false;
  }

  /**
   * Is column visible?
   */
  isColumnShow(key: string): boolean {
    const viewColumns = this.stateSvc.getViewColumns();

    return viewColumns().includes(key);
  }

  /**
   * Toggle column visibility.
   */
  toggleColumn(key: string): void {
    const column = LOG_COLUMNS.find((c) => c.key === key);
    if (!column) {
     return;
    }

    if (column.show === ShowColumn.ALWAYS) {
      // No change allowed.
      return;
    }

    const viewColumns = this.stateSvc.getViewColumns();
    const oldColumns = viewColumns();

    let newColumns = undefined;

    if (oldColumns.includes(key)) {
      newColumns = oldColumns.filter(col => col !== key);
    } else {
      newColumns = [...oldColumns, key];
    }

    this.stateSvc.setViewColumns(newColumns);
  }

  /**
   * Open specified menu.
   * It auto closes after inactivity.
   */
  private openMenu(menu: string) : void {
    const panel = this.panelRef.nativeElement;

    this.activeMenu = menu;

    panel.classList.add('open');
    this.panelState = PanelState.OPENING;

    this.startIdleTimer();

    setTimeout(() => {
      if (this.panelState === PanelState.OPENING) {
        this.panelState = PanelState.OPEN;
      }
    }, this.SLIDE_DURATION_MS);
  }

  /**
   * Close active menu.
   * Optionally, open 'next' menu.
   */
  closeMenu() : void {
    const panel = this.panelRef.nativeElement;

    panel.classList.remove('open');
    this.panelState = PanelState.CLOSING;

    this.stopIdleTimer();

    setTimeout(() => {
      if (this.panelState !== PanelState.CLOSING) {
        return;
      }

      this.activeMenu = null;
      this.panelState = PanelState.CLOSED;

      if (this.nextMenu) {
        // Open next menu
        const menu = this.nextMenu;

        this.nextMenu = null;
        this.openMenu(menu);
      }
    }, this.SLIDE_DURATION_MS);
  }

  private startIdleTimer(): void {
    const panel = this.panelRef.nativeElement;

    this.idleSub = merge(
        of(null),
        fromEvent(panel, 'click')
      )
      .pipe(
        switchMap(() => {
          return timer(this.IDLE_TIMEOUT_MS);
        })
      )
      .subscribe(() => {
        this.closeMenu();
      });
  }

  private stopIdleTimer(): void {
    this.idleSub?.unsubscribe();
    this.idleSub = null;
  }
}
