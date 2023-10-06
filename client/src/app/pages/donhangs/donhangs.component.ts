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
import { Socket } from "ngx-socket-io";
import { SocketService } from "src/app/services/socket.service";
@Component({
  selector: "app-donhangs",
  templateUrl: "./donhangs.component.html",
  styleUrls: ["./donhangs.component.scss"],
})
export class DonhangsComponent {
  dataSource: any;
  displayedColumns: string[] = ["Index", "Tên Khách Hàng", "Phone", "Địa Chỉ"];
  donhangs: any;
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
    private route: Router,
    private socket: SocketService
  ) {
    // this.getAllData();
  }
  async ngOnInit() {
    await this.getAllData();
    await this.onSubmit();
    let dem = 0;
    if (!this.donhangs) {
      const settime = setInterval(async () => {
        await this.getAllData();
        console.log("loading...", ++dem);
        if (this.donhangs) {
          clearInterval(settime);
          return;
        }
      }, 5000);
    }
  }
  async getDataService(): Promise<any> {
    return new Promise((res, rej) => {
      return this.dataService.currentMessage.subscribe((x) => res(x));
    });
  }
  async onSubmit() {
    this.dataService.currentMessage.subscribe(async (data: any) => {
      if (data.submit) {
        const submit = data.submit;
        console.log(submit.bulkDelete);
        console.log(submit.donhang);
        if (submit.donhang) {
          const donhang = submit.donhang;
          this.chitiets = Array.from(submit.donhang["chitiets"]);
          // tao moi don hang
          if (!donhang["Id"]) await this.onPostDh(submit);
          if (donhang["Id"]) {
            console.log("cap nhat don hang");
            await this.onPutDh(submit);
          }
        }
        if (submit.bulkDelete?.length > 0) {
          await this.onDeleteChiTiets(submit);
        }

        console.log("hoan thanh");
        this.dataService.sendMessage({ status: Status.Refesh });
      }
    });
  }
  async onPostDh(submit: any) {
    const donhang = submit.donhang;
    let idDh = "";
    if (!donhang["Id"]) {
      const dh = (await this.service.post(BaseApiUrl.DonHangs, donhang)) as any;
      idDh = dh.data[0]["Id"];
    }
    this.chitiets = Array.from(submit.donhang["chitiets"]).map((x: any) => {
      x["Đơn Hàng"] = idDh;
      return x;
    });
    await this.service.post(BaseApiUrl.ChiTietDonHangs, this.chitiets);
  }
  async onPutDh(submit: any){
    const donhang = submit.donhang;
    let idDh = "";
    if (donhang["Id"]) {
      const dh = (await this.service.put(BaseApiUrl.DonHangs, donhang)) as any;
      console.log(donhang)
      idDh = dh.data[0]["Id"];
    }
    this.chitiets = Array.from(submit.donhang["chitiets"]).map((x: any) => {
      x["Đơn Hàng"] = idDh;
      return x;
    });
  

    await this.service.put(BaseApiUrl.ChiTietDonHangs, this.chitiets);
  }
  async onDeleteChiTiets(submit: any) {
    const nams = Array.from(submit.bulkDelete).map(
      (x: any) => x["Tên sản phấm"]
    );
    const ok = this.dialog.open(DialogAlertComponent, {
      data: `Bạn chắc chắn muốn xóa [${nams.join()}]`,
    });
    ok.afterClosed().subscribe(async (ok: any) => {
      if (ok) {
        const ids = Array.from(submit.bulkDelete).map((x: any) => x["Id"]);
        if (ids.length > 0) {
          await this.service.bulkDelete(BaseApiUrl.ChiTietDonHangs, ids);
        }
      }
    });
  }
  async onCapNhatChiTiets(chitiets: any[]) {}
  async onAddSanPhams(chitiets: any[]) {
    return new Promise(async (res, rej) => {
      const newSps = chitiets.filter(
        (x: ChiTietDonHang) => x["Sản Phẩm"] == ""
      );
      console.log(newSps);
      for (let i = 0; i < newSps.length; i++) {
        const result = (await this.service.post(
          BaseApiUrl.SanpPhams,
          newSps[i]
        )) as any;
        console.log(result);
        if (result.data) {
          const idSp = result.data[0]["Id"];
          newSps[i]["Sản Phẩm"] = idSp;
        }
        await delay(500);
      }
      //this.socket.sendMessage(newSps,'addnewproduct');
      res(newSps);
    });
  }
  onUpdateOrCreateSanphams(chitiets: any[]) {
    return new Promise(async (res, rej) => {
      let data: any[] = [];
      const sanphams = Array.from(this.sanphams);
      chitiets.forEach((chitet: ChiTietDonHang) => {
        console.log(chitet);
        const sp = sanphams.find(
          (x: SanPham) =>
            x["Id"] != "" &&
            chitet["Sản Phẩm"] == x["Id"] &&
            chitet["Đơn giá"] != x["Giá Bán"]
        ) as any;
        if (sp) {
          sp["Giá Bán"] = chitet["Đơn giá"];
          sp["Giá Nhập"] = chitet["Giá Nhập"];
          sp["Đơn Giá"] = chitet["Đơn giá"];
          sp["Số Lượng"] = chitet["Số Lượng"];
          sp["Name"] = chitet["Tên Sản Phẩm"];
          //console.log(sp)
          data.push(sp);
        }
        if (chitet["Sản Phẩm"] == "") {
          console.log(chitet);
          const sp = {
            Id: "",
            Name: chitet["Tên Sản Phẩm"],
            "Giá Nhập": 0,
            "Giá Bán": chitet["Đơn giá"],
            "Đơn Vị Tính": chitet["Đơn Vị Tính"],
          } as SanPham;
          data.push(sp);
        }
      });
      if (data.length > 0) {
        const dialog = this.dialog.open(DialogAlertComponent, {
          data: `Bạn muốn cập nhật sản phấm ${data.map(
            (x: SanPham) => x["Name"]
          )}`,
        });
        const ok = await dialog.afterClosed().toPromise();
        if (ok) {
          return;
        }
      }
      res(data);
    });
  }
  ngAfterContentInit() {}
  async getAllData() {
    const data = (await this.service.get(BaseApiUrl.All)) as any;
    this.all = data;
    this.khachhangs = data["khachhangs"];
    this.sanphams = data["sanphams"];
    this.chitiets = data["chitiets"];
    this.donhangs = data["orders"];
  }
  onDialog() {
    const dialogRef = this.dialog.open(OrdersComponent, { data: this.all });
    dialogRef.afterClosed().subscribe((d: any) => {
      console.log("dong o ");
    });
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
        data: { donhang: item, isDonhang: true, sanphams: this.sanphams },
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
        await this.service.bulkDelete(BaseApiUrl.ChiTietDonHangs, ids);
        await this.service.destroy(BaseApiUrl.DonHangs, item.donhang["Id"]);
        this.dataService.sendMessage(Status.Refesh);
      }
    });
  }
}
