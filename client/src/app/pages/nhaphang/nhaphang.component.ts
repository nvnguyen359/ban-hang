import { ChangeDetectorRef, Component } from "@angular/core";
import { async, isEmpty } from "rxjs";
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
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { DataService } from "src/app/services/data.service";
import { BaseApiUrl, Status } from "src/app/general";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-nhaphang",
  templateUrl: "./nhaphang.component.html",
  styleUrls: ["./nhaphang.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class NhaphangComponent {
  nhaphangs?: NhapHang[];
  nhaphangsGroupNgay: any;
  groupsDate?: any;
  sanphams?: SanPham[] | undefined;

  columnsToDisplay = ["date", "count", "quantity", "tong"];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
  expandedElement: any | null;
  dataSource?: any;

  innerHTML: any;
  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private changeDetectorRefs: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    // this.getAll("nhaphang");
    // this.getProduct();
  }
  ngOnInit() {
    this.loadData();
    //console.log(this.groupsDate)
    this.dataService.currentMessage.subscribe(async (e: any) => {
      if (e.status == Status.Refesh) {
        const nhs = (await this.apiService.get("nhaphang")) as any;
        this.groupsDate = this.groups(
          nhs.map((x: any) => {
            x["Ngày Nhập"] = `${x["Ngày Nhập"]}`.DateFormatDDMMYYY();
            return x;
          })
        );
        this.dataSource.data = this.groupsDate;
        this.changeDetectorRefs.detectChanges();
        this.snackBar.open("Cập Nhật Thành Công!");
      }
    });
  }
  loadData() {
    this.apiService.get(BaseApiUrl.NhapHangs).then((e: any) => {
      const nhaphangs = (e as NhapHang[]).reverse();
      this.nhaphangs = nhaphangs.filter((x: any) => {
        if (x["Ngày Nhập"] != undefined) return x;
      });
      this.groupsDate = this.groups(
        this.nhaphangs.map((x: any) => {
          x["Ngày Nhập"] = `${x["Ngày Nhập"]}`.DateFormatDDMMYYY();
          return x;
        })
      );
      this.dataSource = new MatTableDataSource(this.groupsDate.reverse());
    });
    this.apiService.get(BaseApiUrl.SanpPhams).then((e: any) => {
      this.sanphams = e;
    });
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
      const tong = Array.from(array)
        .map(
          (x: NhapHang) =>
            parseInt(x["Số Lượng"].toString()) *
            parseInt(x["Giá Bán"].toString())
        )
        .reduce((a, b) => a + b, 0);
      const quantity = array
        .map((x: NhapHang) => parseInt(x["Số Lượng"].toString()))
        .reduce((a, b) => a + b, 0);
      const item: GroupDate = {
        date: `${el}`,
        nhaphang: array.map((x: any, index) => {
          x.index = index + 1;
          x["Số Lượng"] = parseInt(x["Số Lượng"]);
          x["Giá Nhập"] = parseInt(x["Giá Nhập"]);
          x["Giá Bán"] = parseInt(x["Giá Bán"]);
          x["Thành tiền"] = x["Số Lượng"] * x["Giá Bán"];
          return x;
        }),
        quantity: quantity.toLocaleString("vi"),
        tong: tong.toLocaleString("vi"),
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
    dt.afterClosed().subscribe((x) => {
      if (x) {
        this.apiService.bulkDelete("nhaphang", ids).then((result: any) => {
          //  console.log(result.data)

          this.dataSource.data = this.groups(
            result.data.map((x: any) => {
              x["Ngày Nhập"] = `${x["Ngày Nhập"]}`.DateFormatDDMMYYY();
              return x;
            })
          );
          this.changeDetectorRefs.detectChanges();
          this.snackBar.open("Xóa Thành Công!");
        });
      }
    });
  }
  onUpdate(element: any = null) {
    // if(!element){
    //   this.dialog.open(OnNhapHangComponent);
    // }
    const nhs = element?.nhaphang ? element?.nhaphang : [];
    this.dialog.open(OnNhapHangComponent, {
      data: nhs,
    });
  }
}
