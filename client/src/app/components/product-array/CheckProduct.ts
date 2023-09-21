import { MatDialog } from "@angular/material/dialog";
import { SanPham } from "src/app/Models/sanPham";
import { ApiService } from "src/app/services/api.service";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import { Injectable } from "@angular/core";
import { SanphamComponent } from "../sanpham/sanpham.component";
import { DataService } from "src/app/services/data.service";
@Injectable()
export class CheckProduct {
  private _dsSanPham: any;
  private _tenSp: any;
  sanphams: any[] = [];
  //private dialog: MatDialog | undefined
  constructor(
    private dialog: MatDialog,
    private service: ApiService,
    private dataService: DataService
  ) {
    dataService.receiveMessage();
  }
  ngOnInit() {}
  set setSProducts(sanphams: any) {
    this._dsSanPham = sanphams;
  }
  set TensSanPahm(tenSps: []) {
    this._tenSp = tenSps;
  }
  /**
   * Thêm mới hoặc cập nhật sản phẩm
   * @param sanphams danh sách sản phẩm
   * @param chitiets chi tiết sản phẩm
   */
  isNewProduct(sanphams: any, chitiets: any): any {
    return new Promise((res, rej) => {
      let updateSanPhams: any[] = [];
      chitiets.forEach((el: any) => {
        const check = sanphams.find(
          (x: any) => x["Name"] == el["Tên Sản Phẩm"]
        );
        if (check) {
          if (check["Giá Bán"] != el["Đơn giá"]) {
            updateSanPhams.push({
              Name: el["Tên Sản Phẩm"],
              "Giá Bán": el["Đơn giá"],
              "Giá Nhập": el["Giá Nhập"],
              "Đơn Vị Tính": el["Đơn Vị Tính"],
              Id: check["Id"],
            });
          }
        }
        if (!check) {
          updateSanPhams.push({
            Name: el["Tên Sản Phẩm"],
            "Giá Bán": el["Đơn giá"],
            "Giá Nhập": 0,
            "Đơn Vị Tính": el["Đơn Vị Tính"],
            Id: "",
          });
        }
      });
      if (updateSanPhams.length > 0) {
        const dilogConfirm = this.dialog.open(DialogConfirmComponent, {
          data: { header: "Bạn Muốn Cập Nhật Giá Bán Không?" },
        });
        dilogConfirm.afterClosed().subscribe((c: boolean) => {
          if (c) {
            const dialogDf = this.dialog.open(SanphamComponent, {
              data: updateSanPhams,
            });
            dialogDf.afterClosed().subscribe((sanphams: any) => {
              res(sanphams);
            });
          }else{
            res(updateSanPhams);
          }
        });
      } else {
        res(updateSanPhams);
      }
    });
  }
}
