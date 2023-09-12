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
@Component({
  selector: "app-donhangs",
  templateUrl: "./donhangs.component.html",
  styleUrls: ["./donhangs.component.scss"],
})
export class DonhangsComponent {
  dataSource: any;
  displayedColumns: string[] = ["Index", "Tên Khách Hàng", "Phone", "Địa Chỉ"];
  donhangs: any;
  hideColumns: any = "Id,Khách Hàng,Nhân Viên,Sản Phẩm";
  options = {
    a: "Tên Khách Hàng",
  };
  @ViewChild(PrintOrderComponent) dirToPrint?: PrintOrderComponent;
  constructor(
    private service: ApiService,
    private readonly dialog: MatDialog,
    private isLoading: IsLoadingServiceX,
    private printer: ThermalPrinterServiceService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
    private route: Router
  ) {}
  async ngOnInit() {
    await this.onGetAll();
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

  async onGetAll() {
    this.isLoading.add();
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
    // this.isLoadingService.remove();
    this.isLoading.remove();
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
    console.log(item);
    if (item.onUpdate == "xoa") {
      const dialogDf = this.dialog.open(DialogAlertComponent, {
        width: "250px",
      });
      dialogDf.afterClosed().subscribe(async (result: any) => {
        if (result == true) {
          this.isLoading.add();
          let dataIds: any[] = [];
          const ids = item.donhang["chitiets"].map(
            (x: ChiTietDonHang) => x["Id"]
          );
          for (let index = 0; index < ids.length; index++) {
            const id = `${ids[index]}`.trim();
            await delay(1000) ;
        
             this.service.destroy("chitietdonhang", id);
            dataIds.push(id);
          }
          await this.service.destroy("donhang", item.donhang["Id"]);
        //  this.dataService.sendMessage(Status.LoadOrder)
          this.isLoading.remove();
        }
      });
    }
  }
}
