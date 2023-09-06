import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "showText",
})
export class ShowTextPipe implements PipeTransform {
  transform(value: any, key: string): string {
    return value[key];
  }
}
