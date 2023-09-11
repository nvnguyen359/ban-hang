import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formmatNumberX",
})
export class FormmatNumberPipeX implements PipeTransform {
  transform(value: any): unknown {
    //console.log(value,Number.isInteger(value))
    const result = Number.isInteger(value)
      ? String(value).replace(/(.)(?=(\d{3})+$)/g, "$1,")
      : value;
     
    return result;
  }
}
