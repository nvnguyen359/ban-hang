import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DonHang } from "src/app/Models/conHang";
import { OrderComponent } from "src/app/components/order/order.component";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-donhangs",
  templateUrl: "./donhangs.component.html",
  styleUrls: ["./donhangs.component.scss"],
})
export class DonhangsComponent {
  dataSource: any;
  displayedColumns: string[] = ["Index", "Tên Khách Hàng", "Phone", "Địa Chỉ"];
  donhangs: any;
  hideColumns:any ='Id,Khách Hàng,Nhân Viên,Sản Phẩm';
  constructor(
    private service: ApiService,
    private readonly dialog: MatDialog
  ) {}
  async ngOnInit() {
    await this.onGetAll();
  }
  onDialog() {
    this.dialog.open(OrderComponent);
  }
  async onGetAll() {
    const donhangx = (await this.service.get("donhang")) as any[];
    const chitiets = (await this.service.get("chitietdonhang")) as any[];
    console.log(chitiets);
    this.donhangs = donhangx.map((x: DonHang) => {
      x["chitiets"] = chitiets.filter((a: any) => a["Đơn Hàng"] == x["Id"]);
      return x;
    });
  }
}
