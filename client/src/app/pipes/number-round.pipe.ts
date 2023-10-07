import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberRound'
})
export class NumberRoundPipe implements PipeTransform {

  transform(value: number): string {
    const nFormat = new Intl.NumberFormat();
    return value>1000?`${nFormat.format(Math.round(value/1000))}k`:`${value}`;
  }

}
