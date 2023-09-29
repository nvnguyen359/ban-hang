import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isNumber'
})
export class IsNumberPipe implements PipeTransform {

  transform(value: any): string {
    return Number.isInteger(value)? parseInt(`${value}`).toLocaleString():`${value}`;
  }

}
