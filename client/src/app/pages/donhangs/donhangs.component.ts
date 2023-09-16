import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DonHang } from "src/app/Models/donHang";
import { OrderComponent } from "src/app/components/order/order.component";
import { ApiService } from "src/app/services/api.service";

import { IsLoadingServiceX } from "src/app/services/is-loading.service";
import { PrintOrderComponent } from "src/app/components/print-order/print-order.component";
import { ThermalPrinterServiceService } from "src/app/services/thermal-printer-service.service";
import { DialogAlertComponent } from "src/app/components/dialog-alert/dialog-alert.component";

import { DataService } from "src/app/services/data.service";
import { Route, Router } from "@angular/router";
import { Status, delay } from "./../../general";
import "../../lib.extensions";

import { ChiTietDonHang } from "src/app/Models/chiTietDonHang";
import { ProductArrayComponent } from "src/app/components/product-array/product-array.component";
import { KhachHang } from "src/app/Models/khachHangs";
@Component({
  selector: "app-donhangs",
  templateUrl: "./donhangs.component.html",
  styleUrls: ["./donhangs.component.scss"],
})
export class DonhangsComponent {
  dataSource: any;
  displayedColumns: string[] = ["Index", "Tên Khách Hàng", "Phone", "Địa Chỉ"];
  donhangs: any;
  khachhangs: any;
  hideColumns: any = "Id,Khách Hàng,Nhân Viên,Sản Phẩm";
  options = {
    a: "Tên Khách Hàng",
  };
  @ViewChild(PrintOrderComponent) dirToPrint?: PrintOrderComponent;
  constructor(
    private service: ApiService,
    private readonly dialog: MatDialog,
    private printer: ThermalPrinterServiceService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
    private route: Router
  ) {}
  async ngOnInit() {
    await this.onGetAll();
    this.getKhachHangs();
    this.dataService.currentMessage.subscribe((data: any) => {
      if (data == Status.Refesh) {
        setTimeout(async () => {
          await this.onGetAll();
          this.dataService.sendMessage(true);
        }, 800);
      }
    });
  }
  ngAfterContentInit() {}
  onDialog() {
    this.dialog.open(OrderComponent);
  }
  getKhachHangs() {
    this.service.get("khachhang").then((data: any) => {
      this.khachhangs = data as KhachHang[];
    });
  }
  async onGetAll() {
    //this.isLoadingService.add({key: ['default', 'single']});
    let donhangx = (await this.service.get("donhang")) as any[];
    donhangx = donhangx.map((x) => {
      x["Ngày Bán"] = `${x["Ngày Bán"]}`.DateFormatDDMMYYY();
      return x;
    });

    const chitiets = (await this.service.get("chitietdonhang")) as any[];

    this.donhangs = donhangx.map((x: DonHang) => {
      x["chitiets"] = chitiets.filter((a: any) => a["Đơn Hàng"] == x["Id"]);
      // x['Tên Khách Hàng'] =` <button mat-button color="primary">${x['Tên Khách Hàng']}</button>`;
      return x;
    });
    this.changeDetectorRefs.detectChanges();
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
      console.log(item);
      item["donhang"]["chitiets"] = Array.from(item["donhang"]["chitiets"]).map(
        (e: any) => {
          e[`Tên sản phẩm`] = e[`Tên Sản Phẩm`];
          e[`Name`] = e[`Tên Sản Phẩm`];
          e["Giá Bán"] = e["Đơn giá"];
          return e;
        }
      );
      this.dialog.open(ProductArrayComponent, {
        data: { donhang: item, isDonhang: true, khachhangs: this.khachhangs },
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
