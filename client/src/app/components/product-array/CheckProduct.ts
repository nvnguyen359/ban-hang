import { MatDialog } from "@angular/material/dialog";
import { SanPham } from "src/app/Models/sanPham";
import { ApiService } from "src/app/services/api.service";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import { Injectable } from "@angular/core";
@Injectable()
export class CheckProduct {
  private _dsSanPham: any;
  private _tenSp: any;
  //private dialog: MatDialog | undefined
  constructor(private dialog: MatDialog, private service: ApiService) {}
  set setSProducts(sanphams: any) {
    this._dsSanPham = sanphams;
  }
  set TensSanPahm(tenSps: []) {
    this._tenSp = tenSps;
  }
  isNewProduct(sanphams: any, dsSp: any) {
    console.log(dsSp);
    dsSp.forEach((el: any) => {
      //console.log(el);
      const check = sanphams.find((x: any) => x["Name"] == el["Tên Sản Phẩm"]);
      if (check) {
      } else {
        const dialogDf = this.dialog?.open(DialogConfirmComponent, {
          data: { header: "Thêm Sản Phẩm Mới " + el["Tên Sản Phẩm"] },
        });
        dialogDf.afterClosed().subscribe((e: boolean) => {
          if (e) {
            el["Name"] == el["Tên Sản Phẩm"];
            console.log('el',el)
            this.service.post("sanpham", el).then((result: any) => {
              console.log("result", result);
            });
          }
        });
      }
    });
  }
}
