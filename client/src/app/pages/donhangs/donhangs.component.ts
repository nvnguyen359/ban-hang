import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DonHang } from "src/app/Models/donHang";
import { OrderComponent } from "src/app/components/order/order.component";
import { ApiService } from "src/app/services/api.service";

import { PrintOrderComponent } from "src/app/components/print-order/print-order.component";
import { ThermalPrinterServiceService } from "src/app/services/thermal-printer-service.service";
import { DialogAlertComponent } from "src/app/components/dialog-alert/dialog-alert.component";

import { DataService } from "src/app/services/data.service";
import { Route, Router } from "@angular/router";
import { BaseApiUrl, Status, delay } from "./../../general";
import "../../lib.extensions";

import { ChiTietDonHang } from "src/app/Models/chiTietDonHang";
import { ProductArrayComponent } from "src/app/components/product-array/product-array.component";
import { KhachHang } from "src/app/Models/khachHangs";
import { SanPham } from "src/app/Models/sanPham";
import { async } from "rxjs";
import { OrdersComponent } from "src/app/components/orders/orders.component";
import { DialogRef } from "@angular/cdk/dialog";
@Component({
  selector: "app-donhangs",
  templateUrl: "./donhangs.component.html",
  styleUrls: ["./donhangs.component.scss"],
})
export class DonhangsComponent {
  dataSource: any;
  displayedColumns: string[] = ["Index", "Tên Khách Hàng", "Phone", "Địa Chỉ"];
  donhangs: any[] = [];
  khachhangs: any[] = [];
  sanphams: any[] = [];
  chitiets: any[] = [];
  hideColumns: any = "Id,Khách Hàng,Nhân Viên,Sản Phẩm";
  options = {
    a: "Tên Khách Hàng",
  };
  all: any;
  @ViewChild(PrintOrderComponent) dirToPrint?: PrintOrderComponent;
  constructor(
    private service: ApiService,
    private readonly dialog: MatDialog,
    private printer: ThermalPrinterServiceService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
    private route: Router
  ) {
    // this.getAllData();
  }
  async ngOnInit() {
    await this.getAllData();
    // this.getKhachHangs();
    // this.getSanPhams();

    // this.dataService.currentMessage.subscribe((data: any) => {
    //   if (data == Status.Refesh) {
    //     setTimeout(async () => {
    //       await this.onGetAll();
    //       this.dataService.sendMessage(true);
    //     }, 800);
    //   }
    // });

    //this.onDialog()
  }
  ngAfterContentInit() {}
  async getAllData() {
    let dem = 0;
    await this.getDhs(dem);
    // const setImer = setInterval(async () => {
    //   const ch = await this.getDhs(dem);
    //   if (ch) {
    //     clearInterval(setImer);
    //   }
    // }, 3000);
  }
  getDhs(dem: any) {
    return new Promise((res, rej) => {
      this.service.get(BaseApiUrl.All).then(async (data: any) => {
        if (data) {
          this.all = data;
          this.khachhangs = data["khachhangs"];
          this.sanphams = data["sanphams"];
          this.chitiets = data["chitiets"];
          this.donhangs = data["orders"];
          if (this.donhangs.length > 0) {
            res(true);
          }
        }
      });
    });
  }
  onDialog() {
    const dialogRef = this.dialog.open(OrdersComponent, { data: this.all });
    dialogRef.afterClosed().subscribe((d: any) => {
      console.log("dong o ");
    });
  }
  getKhachHangs() {
    this.service.get("khachhang").then((data: any) => {
      this.khachhangs = data as KhachHang[];
    });
  }
  getSanPhams() {
    this.service.get("sanpham").then((data: any) => {
      this.sanphams = data as SanPham[];
    });
  }
  async onGetAll(donhangs?: any) {
    this.donhangs = !donhangs
      ? ((await this.service.get("donhang")) as DonHang[])
      : (donhangs as DonHang[]);
    let donhangx = Array.from(this.donhangs as any[]).map((x: any) => {
      x["Ngày Bán"] = `${x["Ngày Bán"]}`.DateFormatDDMMYYY();
      return x;
    });
    const chitiets = this.chitiets as any[];

    this.donhangs = Array.from(donhangx).map((x: any) => {
      x["chitiets"] = chitiets
        .map((x: any) => {
          if (x["Ngày"]) x["Ngày"] = `${x["Ngày"]}`.DateFormatDDMMYYY();
          return x;
        })
        .filter((a: any) => a["Đơn Hàng"] == x["Id"]);
      // x['Tên Khách Hàng'] =` <button mat-button color="primary">${x['Tên Khách Hàng']}</button>`;
      return x;
    });
    // this.changeDetectorRefs.detectChanges();
  }
  eventClickButton(item: any) {
    console.log(item);
  }

  onPrint(item: any) {
    const A5 = "148mm"; //80mm
    this.printer.PaperWidth = A5;
    this.printer.print(item);
  }
  eventDeleteOrUpdate(item: any) {
    if (item.onUpdate == "xoa") {
      this.eventDelete(item);
    } else {
      item["donhang"]["chitiets"] = Array.from(item["donhang"]["chitiets"]).map(
        (e: any) => {
          e[`Tên sản phẩm`] = e[`Tên Sản Phẩm`];
          e[`Name`] = e[`Tên Sản Phẩm`];
          e["Giá Bán"] = e["Đơn giá"];
          return e;
        }
      );

      this.dialog.open(ProductArrayComponent, {
        data: { donhang: item, isDonhang: true,sanphams:this.sanphams },
      });
    }
  }
  eventDelete(item: any) {
    const dialogDf = this.dialog.open(DialogAlertComponent, {
      width: "250px",
    });
    dialogDf.afterClosed().subscribe(async (result: any) => {
      if (result == true) {
        let dataIds: any[] = [];
        const ids = item.donhang["chitiets"].map(
          (x: ChiTietDonHang) => x["Id"]
        );
        for (let index = 0; index < ids.length; index++) {
          const id = `${ids[index]}`.trim();
          await delay(1000);

          this.service.destroy("chitietdonhang", id);
          dataIds.push(id);
        }
        await this.service.destroy("donhang", item.donhang["Id"]);
        //  this.dataService.sendMessage(Status.LoadOrder)
      }
    });
  }
}
