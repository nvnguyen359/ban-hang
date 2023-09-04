import { Component } from "@angular/core";
import { IpcService } from "src/ipc.service";
import { ApiService } from "./services/api.service";
import { PrinterModel } from "./Models/printer";
import { SocketService } from "./services/socket.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "client";
  showFiller = false;
  typesOfShoes: string[] = [
    "Boots",
    "Clogs",
    "Loafers",
    "Moccasins",
    "Sneakers",
  ];
  printers!: any;
  pageSizes: string[] = ["A4", "A5", "A6", "A7"];
  ver: string = JSON.stringify(localStorage.getItem("ver"));
  constructor(
    private readonly apiService: ApiService,
    private socket: SocketService
  ) {
    this.getVersion();
    setTimeout(() => {
      this.getVersion();
    }, 10000);
  }
  getVersion() {
    this.socket.getMessage().subscribe((x: any) => {
      if (x?.ver) {
        if (!localStorage.getItem("ver")) {
          localStorage.setItem("ver", x.ver);
        } else {
          this.ver = x.ver;
        }
        console.log(this.ver);
      }
    });
  }
}
