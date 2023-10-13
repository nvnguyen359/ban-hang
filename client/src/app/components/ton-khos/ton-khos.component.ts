import { Component } from "@angular/core";

@Component({
  selector: "app-ton-khos",
  templateUrl: "./ton-khos.component.html",
  styleUrls: ["./ton-khos.component.scss"],
})
export class TonKhosComponent {
  constructor() {
    const tonkhos = JSON.parse(`${localStorage.getItem("sumTk")}`);
    console.log(tonkhos);
  }
}
