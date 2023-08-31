import { Component } from "@angular/core";
import { isEmpty } from "rxjs";
import { GroupDate, NhapHang } from "src/app/Models/nhapHang";
import { ApiService } from "src/app/services/api.service";
import "./../../lib.extensions";
@Component({
  selector: "app-nhaphang",
  templateUrl: "./nhaphang.component.html",
  styleUrls: ["./nhaphang.component.scss"],
})
export class NhaphangComponent {
  nhaphangs?: NhapHang[];
  nhaphangsGroupNgay: any;
  groupsDate?: GroupDate[];
  constructor(private apiService: ApiService) {
    this.getAll("nhaphang");
  }
  getAll(nameSheet: string, item?: any) {
    this.apiService.get(nameSheet).then((e) => {
      this.nhaphangs = (e as NhapHang[]).filter((x: any) => {
        if (x["Ngày Nhập"] != undefined) return x;
      });

      this.groupsDate = this.groups(this.nhaphangs);
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
      console.log(array, el);
      const item: GroupDate = {
        date: `${el}`.convertDateVNToISO(),
        nhaphang: array.map((x, index) => {
          x.index = index + 1;
          x["Số Lượng"] = parseInt(x["Số Lượng"].toString());
          x["Giá Nhập"] = parseInt(x["Giá Nhập"].toString());
          x["Giá Bán"] = parseInt(x["Giá Bán"].toString());
          x["Thành tiền"] = x['Số Lượng']*x['Giá Bán']
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
}
