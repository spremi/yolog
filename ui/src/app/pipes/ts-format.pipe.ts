import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tsFormat'
})
export class TsFormatPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
