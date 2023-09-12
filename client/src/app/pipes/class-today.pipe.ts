import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classToday'
})
export class ClassTodayPipe implements PipeTransform {

  transform(value: any): string {

    const today = new Date();
    const t = value.split("/");
    const current = new Date(parseInt(t[2]), parseInt(t[1])-1, parseInt(t[0]));
   // console.log(current.toLocaleDateString(),today.toLocaleDateString(),current.toLocaleDateString()==today.toLocaleDateString())
   const result = current.toLocaleDateString()==today.toLocaleDateString()?'tr-today':'fal';
   console.log(result)
   return result;
  }

}
