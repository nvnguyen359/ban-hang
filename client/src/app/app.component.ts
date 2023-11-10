import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { ApiService } from "./services/api.service";
import { SocketService } from "./services/socket.service";

import { MatDialog } from "@angular/material/dialog";
import { OrderComponent } from "./components/order/order.component";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { DataService } from "./services/data.service";
import { async } from "@angular/core/testing";
import { Router } from "@angular/router";
import { BaseApiUrl } from "./general";
import { SanPham } from "./Models/sanPham";
import { ChiTietDonHang } from "./Models/chiTietDonHang";
import { NhapHang } from "./Models/nhapHang";
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
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private router: Router
  ) {
    this.getVersion();
  }

  async getAllData() {
    const all = localStorage.getItem("all");
    if (this.flagOffline) {
      this.dataService.sendMessage(JSON.parse(all + ""));
      return;
    }
    let dem = 0;
    const n = await this.getAll();
  }
  async getAll() {
    let data = (await this.service.get("all")) as any;
    if (!localStorage.getItem("all")) {
      localStorage.setItem("all", JSON.stringify({ all: data }));
    }
    this.dataService.sendMessage({ all: data });
    return data["donhangs"].length;
  }
  async getData() {
    return await this.service.get("all");
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
  dem = 0;
  asyncGetAll() {
    this.socket.getMessage("all").subscribe((data: any) => {
      console.log(data['sanphams'])
      if (data && data["sanphams"].length > 0) {
        localStorage.setItem("all", JSON.stringify(data));
      }
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (location.pathname == "/")
        this.router.navigate([`/${BaseApiUrl.BaoCaos}`]);
    }, 500);
    this.french();
    this.asyncGetAll();
    setInterval(() => {
      // console.log(this.dem++)
      this.asyncGetAll();
      // console.log(localStorage.getItem('all'))
    }, 30000);
    this.socket
      .getMessage("tonkho")
      .subscribe((data: any) =>
        localStorage.setItem("tonkho", JSON.stringify(data))
      );
    this.tonKho();
  }
  tonKho() {
    let tonkho = JSON.parse(`${localStorage.getItem("tonkho")}`) as any;
    const nhahangs = tonkho["nhaphangs"] as NhapHang[];
    console.log(nhahangs);
    const all = JSON.parse(`${localStorage.getItem("all")}`);
    let tonkhos: any[] = [];
    Array.from(all["sanphams"] as SanPham[]).forEach((sanpham: SanPham) => {
      const chitiets = Array.from(
        tonkho["chitiets"] as ChiTietDonHang[]
      ).filter((x: ChiTietDonHang) => x["Sản Phẩm"] == sanpham.Id);
      const slChiTiet = chitiets
        .map((x: any) => parseInt(x["Số Lượng"]))
        .reduce((a: any, b: any) => a + b, 0);
      const nhs = nhahangs.filter((x: NhapHang) => x["Sản Phẩm"] == sanpham.Id);
      const slNhs = nhs
        .map((x: any) => parseInt(x["Số Lượng"]))
        .reduce((a: any, b: any) => a + b, 0);
      const moneyNhaphangs = nhs
        .map((x: any) => parseInt(x["Số Lượng"]) * parseInt(x["Giá Nhập"]))
        .reduce((a: any, b: any) => a + b, 0);
      const moneyChititets = chitiets
        .map((x: any) => parseInt(x["Số Lượng"]) * parseInt(x["Giá Bán"]))
        .reduce((a: any, b: any) => a + b, 0);
      const item = {
        Tên: sanpham["Name"],
        "Nhập Hàng": slNhs,
        "Xuất Hàng": slChiTiet,
        "Tồn Kho": slNhs - slChiTiet,
        "Giá Trị": moneyNhaphangs - moneyChititets,
      };
      tonkhos.push(item);
    });
    tonkho["ton"] = tonkhos;
    localStorage.setItem("sumTk", JSON.stringify(tonkhos));
  }
  ngAfterViewInit() {}
}
