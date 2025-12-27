import { Component, Input } from '@angular/core';
import { LogEntry } from '@base/app.types';
import { LOG_KEYS, LOG_LABELS } from '@base/models/log-column';

@Component({
  selector: 'sp-log-detail',
  imports: [],
  templateUrl: './log-detail.component.html',
  styleUrl: './log-detail.component.sass'
})
export class LogDetailComponent {
  @Input() log!: LogEntry | null;

  readonly labels = LOG_LABELS;
  readonly keys = LOG_KEYS;
}
