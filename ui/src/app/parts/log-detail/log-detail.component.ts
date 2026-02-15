//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, Input } from '@angular/core';
import { LogEntry } from '@base/app.types';
import { LOG_KEYS, LOG_LABELS } from '@base/models/log-column';
import { TsFormatPipe } from '@pipes/ts-format.pipe';

@Component({
  selector: 'sp-log-detail',
  imports: [TsFormatPipe],
  templateUrl: './log-detail.component.html',
  styleUrl: './log-detail.component.sass'
})
export class LogDetailComponent {
  @Input() log!: LogEntry | null;

  readonly labels = LOG_LABELS;
  readonly keys = LOG_KEYS;
}
