//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { computed, inject, Injectable, Signal } from '@angular/core';
import { StateService } from './state.service';
import { DEFAULT_TIMEZONE } from '@base/app.defaults';
import { TsMode } from '@base/app.types';

@Injectable({
  providedIn: 'root'
})
export class TsFormatterService {

  stateSvc = inject(StateService);

  private readonly zone: Signal<string> = this.stateSvc.getTimeZone();
  private readonly mode: Signal<TsMode> = this.stateSvc.getTsMode();

  // Cached time-formatter.
  // Wil be re-created only when the timezone changes.
  private readonly timeFormatter:  Signal<Intl.DateTimeFormat> =
    computed<Intl.DateTimeFormat>(() => {
      const tz: string = this.zone();

      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    });

  // Cached date-formatter.
  // Wil be re-created only when the timezone changes.
  private readonly dateFormatter:  Signal<Intl.DateTimeFormat> =
    computed<Intl.DateTimeFormat>(() => {
      const tz: string = this.zone();

      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    });

  /**
   * Formats ISO date string based on timezone and mode in the settings.
   * It specifically preserves fractional-second precision.
   */
  public format(iso: string): string {
    if (!iso) {
      return '';
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      // Return original string. (Ideally, we should never reach here.)
      return iso;
    }

    const zone = this.zone();   // Current timezone
    const mode = this.mode();   // Current mode

    // Extract fractional seconds to preserve full precision.
    // (Javascript precision is milliseconds only)
    const fractionMatch = iso.match(/\.(\d+)(?=[+-]|Z)/);
    const fraction = fractionMatch?.[1] ?? '';

    // Format time
    const time = this.timeFormatter().format(date);

    if (mode === 'TIME') {
      return `${time}.${fraction}`;
    }

    // Format date
    const parts = this.dateFormatter().formatToParts(date);

    const year = parts.find(p => p.type === 'year')?.value ?? '0000';
    const month = parts.find(p => p.type === 'month')?.value ?? '00';
    const day = parts.find(p => p.type === 'day')?.value ?? '00';

    return `${year}-${month}-${day} ${time}.${fraction}`;
  }
}
