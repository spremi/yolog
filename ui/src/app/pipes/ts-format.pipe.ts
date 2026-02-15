//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { inject, Pipe, PipeTransform } from '@angular/core';
import { TsFormatterService } from '@base/services/ts-formatter.service';

@Pipe({
  name: 'tsFormat',
  pure: true          // Recompute only when input changes.
})
export class TsFormatPipe implements PipeTransform {

  private formatSvc = inject(TsFormatterService);

  transform(iso: string): string {
    return this.formatSvc.format(iso);
  }
}
