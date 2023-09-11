import { Component, Input } from "@angular/core";

@Component({
  selector: "app-print-order",
  templateUrl: "./print-order.component.html",
  styleUrls: ["./print-order.component.scss"],
})
export class PrintOrderComponent {
  //@Input() data: any;
  constructor() {}
  print(d: any) {
    console.log('print')
    console.log(d);
   // this.data = d;
   // console.log(this.data);
  }
}
