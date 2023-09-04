import { Component } from "@angular/core";
import { isEmpty } from "rxjs";
import { GroupDate, NhapHang } from "src/app/Models/nhapHang";
import { ApiService } from "src/app/services/api.service";
import "./../../lib.extensions";

declare var name: any;
declare var createInput: any;
import "../../../assets/lib.js";
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmComponent } from "src/app/components/dialog-confirm/dialog-confirm.component";
import { SanPham } from "src/app/Models/sanPham";
import { OnNhapHangComponent } from "src/app/components/on-nhap-hang/on-nhap-hang.component";
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: "app-nhaphang",
  templateUrl: "./nhaphang.component.html",
  styleUrls: ["./nhaphang.component.scss"],
})
export class NhaphangComponent {
  nhaphangs?: NhapHang[];
  nhaphangsGroupNgay: any;
  groupsDate?: GroupDate[];
  sanphams?: SanPham[] | undefined;
  innerHTML:any
  constructor(private apiService: ApiService, public dialog: MatDialog,private sanitizer:DomSanitizer) {
    this.getAll("nhaphang");
    this.getProduct();
    const columns = `
    <mat-form-field class="example-full-width">
     <mat-label>Favorite food</mat-label>
     <input matInput placeholder="Ex. Pizza" value="Sushi">
   </mat-form-field>`;
   this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(columns)
  }
  getAll(nameSheet: string, item?: any) {
    this.apiService.get(nameSheet).then((e) => {
      this.nhaphangs = (e as NhapHang[]).filter((x: any) => {
        if (x["Ngày Nhập"] != undefined) return x;
      });

      this.groupsDate = this.groups(this.nhaphangs);
    });
  }
  async getProduct() {
    this.apiService.get("sanpham").then((e) => {
      this.sanphams = e as SanPham[];
      //  console.log(this.sanphams);
    });
  }
  groups(nhaphangs: any) {
    const ngayNhaps = [
      ...new Set(Array.from(nhaphangs).map((x: any) => x["Ngày Nhập"])),
    ].filter((x) => x != undefined);
    let data: GroupDate[] = new Array();
    [...new Set(ngayNhaps.filter((x) => x != undefined))].forEach((el: any) => {
      const array: NhapHang[] = nhaphangs.filter(
        (x: NhapHang) => `${x["Ngày Nhập"]}` == el
      );
      const item: GroupDate = {
        date: `${el}`.convertDateVNToISO(),
        nhaphang: array.map((x, index) => {
          x.index = index + 1;
          x["Số Lượng"] = parseInt(x["Số Lượng"].toString());
          x["Giá Nhập"] = parseInt(x["Giá Nhập"].toString());
          x["Giá Bán"] = parseInt(x["Giá Bán"].toString());
          x["Thành tiền"] = x["Số Lượng"] * x["Giá Bán"];
          return x;
        }),
        quantity: array
          .map((x: NhapHang) => parseInt(x["Số Lượng"].toString()))
          .reduce((a, b) => a + b, 0),
        tong: Array.from(array)
          .map(
            (x: NhapHang) =>
              parseInt(x["Số Lượng"].toString()) *
              parseInt(x["Giá Bán"].toString())
          )
          .reduce((a, b) => a + b, 0),
        count: array.length,
      };
      data.push(item);
    });
    return data.sort(
      (a: GroupDate, b: GroupDate) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
  onDelete(element: GroupDate) {
    const nhapHangs = element.nhaphang as NhapHang[];
    const ids = element?.nhaphang ? element?.nhaphang.map((x) => x.Id) : [];
    const info = {
      title: "Bạn Chắc Chắn muốn xóa " + nhapHangs[0]["Ngày Nhập"],
      header: "Xóa Ngày Nhập Hàng",
    };
    const dt = this.dialog.open(DialogConfirmComponent, { data: info });
    dt.afterClosed().subscribe((x) => console.log(x));
  }
  onUpdate(element?: GroupDate) {
    const nhs = element?.nhaphang ? element?.nhaphang : [];
    // console.log(nhs);
    // console.log(this.sanphams)
   
    this.dialog.open(OnNhapHangComponent, {
      data: { nhs, sanphams: this.sanphams },
    });
  }
}
