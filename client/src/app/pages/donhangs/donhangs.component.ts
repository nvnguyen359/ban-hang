import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DonHang } from "src/app/Models/donHang";
import { OrderComponent } from "src/app/components/order/order.component";
import { ApiService } from "src/app/services/api.service";
import "../../lib.extensions";
import { IsLoadingServiceX } from "src/app/services/is-loading.service";
import { PrintOrderComponent } from "src/app/components/print-order/print-order.component";
import { ThermalPrinterServiceService } from "src/app/services/thermal-printer-service.service";
import { DialogAlertComponent } from "src/app/components/dialog-alert/dialog-alert.component";
import { async } from "@angular/core/testing";
import { DataService } from "src/app/services/data.service";
import { Route, Router } from "@angular/router";
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
    private route:Router
  ) {}
  async ngOnInit() {
    await this.onGetAll();
    localStorage.setItem('url',this.route.url.replace('/','').trim())
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
    console.log(localStorage.getItem("printer"));
    this.printer.PaperWidth = A5;
    this.printer.print(item);
  }
  eventDeleteOrUpdate(item: any) {
    if (item.onUpdate == "xoa") {
      const dialogDf = this.dialog.open(DialogAlertComponent, {
        width: "250px",
      });
      dialogDf.afterClosed().subscribe((result: any) => {
        if (result == true) {
          this.service
            .destroy("donhang", item.donhang["Id"])
            .then((data: any) => {
              console.log('gui tin nhan')
              this.dataService.sendMessage(true);
            });
        }
      });
    }
  }
}
