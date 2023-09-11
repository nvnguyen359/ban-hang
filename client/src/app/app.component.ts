import { AfterViewInit, Component, OnInit } from "@angular/core";
import { IpcService } from "src/ipc.service";
import { ApiService } from "./services/api.service";
import { PrinterModel } from "./Models/printer";
import { SocketService } from "./services/socket.service";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { Observable, filter } from "rxjs";

import { MatDialog } from "@angular/material/dialog";
import { OrderComponent } from "./components/order/order.component";
import { IsLoadingServiceX } from "./services/is-loading.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {

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
  loadingService: any;
  constructor(
    private readonly apiService: ApiService,
    private socket: SocketService,
    private router: Router,
    private isLoading:IsLoadingServiceX,
    private readonly dialog: MatDialog
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
  loading() {

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe((event) => {
        // if it's the start of navigation, `add()` a loading indicator
        if (event instanceof NavigationStart) {
          console.log("loading");
      this.isLoading.add();
          return;
        }
      this.isLoading.remove();
        // else navigation has ended, so `remove()` a loading indicator
        console.log("loaded");
      });
  }
  onOpenDialog(){
    this.dialog.open(OrderComponent)
  }
  ngOnInit() {
    this.loading();
   // this.onOpenDialog();
  }

  ngAfterViewInit() {}
}
