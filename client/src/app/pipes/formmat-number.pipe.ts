import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formmatNumberX",
})
export class FormmatNumberPipeX implements PipeTransform {
  transform(value: any): string {
    //console.log(value, this.isNumeric(value),value.toLocaleString('vi-VN'));
    if (value == undefined) return value;
    return value.toLocaleString('vi-VN');
  }
  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }
}
