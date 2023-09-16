import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { IpcService } from "src/ipc.service";
import { ApiService } from "./services/api.service";
import { PrinterModel } from "./Models/printer";
import { SocketService } from "./services/socket.service";
import {
  ActivatedRoute,
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
import { LoaderService } from "./services/loader.service";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  baseServer = "http://localhost:3177";
  title = "client";
  showFiller = false;
  showBtDonHang = false;
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
  url: any;
  constructor(
    private socket: SocketService,
    private readonly dialog: MatDialog,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
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

  onOpenDialog() {
    const dia = this.dialog.open(OrderComponent);
    dia.afterClosed().subscribe(() => {
      // window.location.href = JSON.stringify(localStorage.getItem('url')).replaceAll('"','');
      if (!this.url.includes("/donhang"))
        window.location.href = this.baseServer + this.url;
    });
  }
  french() {
    this._locale = 'vi';
    this._adapter.setLocale(this._locale);
  }
  ngOnInit(): void {
    this.french()
  }
  ngAfterViewInit() {
  
  }
}
