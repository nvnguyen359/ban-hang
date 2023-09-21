import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { ApiService } from "./services/api.service";
import { SocketService } from "./services/socket.service";

import { MatDialog } from "@angular/material/dialog";
import { OrderComponent } from "./components/order/order.component";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { DataService } from "./services/data.service";
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
  infor = "";
  printers!: any;
  pageSizes: string[] = ["A4", "A5", "A6", "A7"];
  ver: string = JSON.stringify(localStorage.getItem("ver"));
  loadingService: any;
  url: any;
  flagOffline = false;
  constructor(
    private socket: SocketService,
    private readonly dialog: MatDialog,
    private _adapter: DateAdapter<any>,
    private service: ApiService,
    private dataService: DataService,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this.getVersion();
    //this.getAllData();
  }

  getAllData() {
    const all = localStorage.getItem("all");

    if (this.flagOffline) {
      this.dataService.sendMessage(JSON.parse(all + ""));
      return;
    }
    this.service.get("all").then((data: any) => {
      if (!localStorage.getItem("all")) {
        localStorage.setItem("all", JSON.stringify({ all: data }));
      }
      this.dataService.sendMessage({ all: data });
    });
  }
  getAll(){

  }
  getVersion() {
    this.socket.getMessage().subscribe((x: any) => {
      if (x?.ver) {
        if (!localStorage.getItem("ver")) {
          localStorage.setItem("ver", x.ver);
        } else {
          this.ver = x.ver;
        }
        this.infor = x.mes;
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
    this._locale = "vi";
    this._adapter.setLocale(this._locale);
  }
  ngOnInit(): void {
    this.french();
    this.getAllData();
  }
  ngAfterViewInit() {}
}
