import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formmatNumberX'
})
export class FormmatNumberPipeX implements PipeTransform {
  transform(value: any): unknown {
    const result= Number.isInteger(value)?String(value).replace(/(.)(?=(\d{3})+$)/g,'$1,'): value;
    console.log(result)
    return result
  }

}
