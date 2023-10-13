import { Component, ElementRef, Inject, Input } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { async } from "rxjs";
import { ChiTiet, ChiTietDonHang } from "src/app/Models/chiTietDonHang";
import { DonHang } from "src/app/Models/donHang";
import { KhachHang } from "src/app/Models/khachHangs";
import { SanPham } from "src/app/Models/sanPham";
import { BaseApiUrl, Status, delay } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import "../../lib.extensions";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import { CheckProduct } from "./CheckProduct";
import { DialogCustomerComponent } from "../dialog-customer/dialog-customer.component";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

/**
 *
 *
 * @export
 * @class ProductArrayComponent
 */
@Component({
  selector: "app-product-array",
  templateUrl: "./product-array.component.html",
  styleUrls: ["./product-array.component.scss"],
  providers: [CheckProduct],
})
export class ProductArrayComponent {
  chekProduct: any;
  chietKhauChecked: any;
  danhsachTenSanPham: any = [];
  sanphams: any[] = [];
  initSanpham?: SanPham;
  donhang: any;
listKhs?:any;
  khachhangs?: any;
  formGroup?: any = this.fb.group({
    Id: "",
    "Tên Khách Hàng": ["", Validators.required],
    "Khách hàng": "",
    "Tiền Công": [""],
    "Phí Ship": [""],
    "Trạng Thái": [""],
    "Thành Tiền": [""],
    "Đơn Hàng": ["", Validators.required],
    "Ngày Bán": [new Date(), Validators.required],
    chitiets: this.fb.array([]),
  });

  chitietsDonHangs?: any = [];
  keysChitiet: any = [];
  showKeys: any = [];
  isDonHang: boolean = false;
  title: string = "";
  showTitle: boolean = true;
  chietkhau = 0;
  donvi = 1000;
  statusText = "Đặt Hàng";
  @Input() dataAll: any;
  @Input() newOrder = false;
  optionButtonUpdate = true;
  defaultKh: any = null;
  ngay?: any;
  constructor(
    private fb: FormBuilder,
    private serviceApi: ApiService,
    private dialog: MatDialog,
    private checkProduct: CheckProduct,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  async ngOnInit() {
    this.ngay = new Date();
    this.statusText = "Đặt Hàng";
    this.showKeys = ["Id", "Tên Sản Phẩm", "Đơn giá", "Số Lượng"];

    if (this.newOrder) {
      this.title = `Tạo Mới Đơn Hàng`;
      this.initNoInputData();
      this.showTitle = true;
    } else {
      console.log("cap");
      await this.switchCase();
    }
    // this.getDataService();
  }
  initNoInputData() {
    this.optionButtonUpdate = false;
    this.formGroup = this.fb.group({
      Id: [""],
      "Tên Khách Hàng": ["", Validators.required],
      "Khách Hàng": ["", Validators.required],
      "Tiền Công": [""],
      "Chiết Khấu": [""],
      "Trạng Thái": ["Đặt Hàng", Validators.required],
      "Thành Tiền": [""],
      "Ngày Bán": [new Date(), Validators.required],
      chitiets: this.fb.array([]),
    });
    if (this.khachhangs == undefined) {
      // this.getDataService();
      this.khachhangs = this.dataAll["khachhangs"];
      this.listKhs = this.khachhangs.reverse()
      this.defaultKh= this.khachhangs.find((x:any)=>x['selected']==true);
   
      this.sanphams = this.dataAll["sanphams"].reverse();
      this.onAdd();
      this.onAdd();
      this.onAdd();
    }
    // this.statusText=this.formGroup.value['Trạng Thái']
    console.log("khoi tao ");
  }
  getDataService(): any {
    return new Promise(async (res, rej) => {
      try {
        let result: any = await this.serviceApi.get(BaseApiUrl.All);
        console.log(result);
        this.sanphams = Array.from(result["sanphams"]);
        this.khachhangs = Array.from(result["khachhangs"]).reverse() as KhachHang[];
        res(result);
      } catch (error) {
        res(null);
      }
    });
  }
  eventChangeStatus(event: any) {
    const values = this.formGroup.value;
    values["Trạng Thái"] = event;
    this.formGroup.patchValue(values);
    console.log(event);
  }
  async switchCase() {
    if (!this.data) {
      console.log("khong cos data");
      return;
    }
    // ['donhang', 'isDonhang', 'khachhangs']
    if (this.data.sanphams) {
      this.sanphams = this.data.sanphams;
    }
    const keys = Object.keys(this.data);
    if (keys.includes("donhang")) {
      this.isDonHang = true;
      this.donhang = this.data["donhang"]["donhang"] as DonHang;
      this.chitietsDonHangs = this.donhang["chitiets"];
      this.danhsachTenSanPham = this.chitietsDonHangs.map(
        (x: any) => x["Tên Sản Phẩm"]
      );
      this.keysChitiet = Object.keys(this.chitietsDonHangs[0]);

      if (this.data["isDonhang"] && this.donhang["chitiets"].length > 0)
        this.title = `Cập Nhật Đơn Hàng <b>${this.donhang["Id"]}</b>`;
      this.showTitle = false;
      await this.initDonHang();
    }
  }

  async initDonHang() {
    const dh = this.donhang;
    const formArray = this.fb.array([]) as FormArray;
    const chitiets = dh["chitiets"] as ChiTietDonHang[];
    for (let index = 0; index < chitiets?.length; index++) {
      const chitiet = chitiets[index] as any;
      const keys = Object.keys(chitiet);
      let obj: any = {};
      keys.forEach((key: string) => {
        obj[key] = chitiet[key];
      });
      formArray.push(this.fb.group(obj));
    }

    this.formGroup = this.fb.group({
      Id: [dh["Id"]],
      "Khách Hàng": [dh ? dh["Khách Hàng"] : "" || ""],
      "Tên Khách Hàng": [
        dh ? dh["Tên Khách Hàng"] : "" || "",
        Validators.required,
      ],
      "Tiền Công": [dh ? dh["Tiền Công"] : "" || ""],
      "Chiết Khấu": [dh ? dh["Chiết Khấu"] : "" || ""],
      "Trạng Thái": [dh ? dh["Trạng Thái"] : "" || "", Validators.required],
      "Thành Tiền": [dh ? dh["Thành Tiền"] : "" || ""],
      "Ngày Bán": [
        dh
          ? `${dh["Ngày Bán"]}`.convertDateVNToISO()
          : "" || new Date().toLocaleDateString(),
        Validators.required,
      ],
      chitiets: formArray,
    });
  }

  async checkEvent() {
    if (this.data["isDonhang"]) {
      this.donhang = this.data["donhang"]["donhang"] as DonHang;
      // console.log(this.donhang);
    }
  }

  isNumeric(str?: any) {
    if (typeof str != "string") return false; // we only process strings!
    return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
  }
  updateArray() {
    let values = this.formGroup.value;
    let chitiets = Array.from(values["chitiets"]);
    chitiets.forEach((e: any) => {
      e["Thành Tiền"] = e["Đơn giá"] * e["Số Lượng"];
    });
    values["chitiets"] = chitiets;
    this.formGroup.patchValue(values);
  }
  onChangeValue(event?: any, index?: number) {
    if (!event) {
      this.updateArray();
      return;
    }
    const tenSp = event.value;
    const sps = this.sanphams;
    let values = this.formGroup.value;
    //console.log(values)
    let chitiets = Array.from(values["chitiets"]);
    // chitiets = chitiets.map((e: any) => {
    //   const sp = sps.find((x: any) => x["Name"] == tenSp);
    //   e["Thành Tiền"] = parseInt(e["Đơn giá"]) * parseInt(e["Số Lượng"]);
    //   if (sp) {
    //     e["Sản Phẩm"] = sp["Id"];
    //     e["Đơn Vị Tính"] = sp["Đơn Vị Tính"];
    //   }

    //   e["Đơn Hàng"] = values["Id"];
    //   return e;
    // });
    try {
      const checkSps = Array.from(
        this.formGroup.value["chitiets"].map((x: any) => x["Tên Sản Phẩm"])
      ).filter((x: any) => x == tenSp);
      if (checkSps.length > 1) {
        this.dialog.open(DialogConfirmComponent, {
          data: {
            title: `${tenSp} đã có trong danh sách`,
            header: "Cảnh Báo!",
          },
        });
        if (index) {
          chitiets = chitiets.map((x: any, i: number) => {
            if (i == index) {
              x["Tên Sản Phẩm"] = "";
              return x;
            }
          });
        }
        event.value = "";
        values["chitiets"] = chitiets;
        this.formGroup.patchValue(values);
        return;
      }
      const sp: SanPham = this.sanphams.find(
        (x: SanPham) => x["Name"] == tenSp
      );
      if (sp) {
        chitiets.forEach((e: any) => {
          if (e["Tên Sản Phẩm"] == sp["Name"]) {
            e["Tên Sản Phẩm"] = sp["Name"];
            e["Đơn giá"] = sp["Giá Bán"];
            e["Đơn Vị Tính"] = sp["Đơn Vị Tính"];
            const dongia = sp["Giá Bán"] || 0;
            e["Thành Tiền"] = dongia * e["Số Lượng"];
            e["Đơn Hàng"] = values["Id"];
            e["Sản Phẩm"] = sp["Id"];
            e["Giá Nhập"] = sp["Giá Nhập"];
          }
        });
      }
    } catch (error) {}
    values["chitiets"] = chitiets;

    // console.log(values);
    this.formGroup.patchValue(values);
  }
  async onCal() {
    const donhang = this.formGroup.value;
    const chitiets = donhang["chitiets"];
    const sumSoLuong = chitiets
      .map((a: any) => parseInt(a["Số Lượng"]))
      .reduce((a: number, b: number) => a + b, 0);
    const sumThanhTien = chitiets
      .map((a: any) => parseInt(a["Thành Tiền"]))
      .reduce((a: number, b: number) => a + b, 0);

    const chietkhau =
      this.chietKhauChecked == "%"
        ? ((parseInt(donhang["Chiết Khấu"]) || 0) * sumThanhTien) / 100
        : parseInt(donhang["Chiết Khấu"] || 0) * this.donvi;

    const tiencong = parseInt(donhang["Tiền Công"]) * this.donvi || 0;
    const thanhtoan = sumThanhTien - chietkhau + tiencong;
    this.formGroup.value["Thanh Toán"] = thanhtoan;
    this.formGroup.value["Số Lượng"] = sumSoLuong;
    this.formGroup.value["Tiền Công"] = tiencong;
    this.formGroup.value["Thành Tiền"] = sumThanhTien;
    const date = this.formGroup.value["Ngày Bán"];
    this.formGroup.value["Ngày Bán"] = date;
  }
  onUpdateForm() {
    // console.log("chietKhauChecked", this.chietKhauChecked);
    const donhang = this.formGroup.value;
    let chietkhau =
      this.chietKhauChecked == "%"
        ? ((parseInt(donhang["Chiết Khấu"]) || 0) *
            this.formGroup.value["Thành Tiền"]) /
          100
        : parseInt(donhang["Chiết Khấu"] || 0) * this.donvi;
    if (this.chietKhauChecked == undefined) {
      chietkhau = parseInt(donhang["Chiết Khấu"] || 0);
    }
    const chitiets = donhang["chitiets"];
    const sumSoLuong = chitiets
      .map((a: any) => parseInt(a["Số Lượng"]))
      .reduce((a: number, b: number) => a + b, 0);
    const sumThanhTien = chitiets
      .map((a: any) => parseInt(a["Thành Tiền"]))
      .reduce((a: number, b: number) => a + b, 0);
    const tiencong = parseInt(donhang["Tiền Công"]) * this.donvi || 0;
    const thanhtoan = sumThanhTien - chietkhau + tiencong;
    this.formGroup.value["Thanh Toán"] = thanhtoan;
    this.formGroup.value["Số Lượng"] = sumSoLuong;
    this.formGroup.value["Tiền Công"] = tiencong;
    this.formGroup.value["Thành Tiền"] = sumThanhTien;
    this.formGroup.value["Chiết Khấu"] = chietkhau;
  }
  removeAts: any[] = [];
  onDelete(index: number) {
    const ctrl = this.formGroup.controls["chitiets"];
    const value = ctrl.value;
    const removeItem = ctrl.value.at(index);
    if (removeItem["Id"] != "") this.removeAts.push(removeItem);
    ctrl.setValue(
      value
        .slice(0, index)
        .concat(value.slice(index + 1))
        .concat(value[index])
    );
    ctrl.removeAt(value.length - 1);
    return;
    const chitiet = this.formGroup.controls["chitiets"].at(index).value;
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      data: `Bạn Chắc Chắn Xóa [${chitiet["Tên Sản Phẩm"]}] ra khỏi đơn hàng ?`,
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.serviceApi
          .destroy("chitietdonhang", chitiet["Id"])
          .then((result: any) => {
            console.log(result);
            this.formGroup.controls["chitiets"].removeAt(index);
          });
      }
    });
    //console.log(chitiet)
  }
  onAdd(item?: any) {
    // console.log(item);
    const arr = this.formGroup.controls["chitiets"] as FormArray;
    arr.push(
      this.fb.group({
        Id: "",
        Ngày: [item ? item["Ngày"] : ""],
        "Tên Sản Phẩm": [item ? item["Name"] : "", Validators.required],
        "Đơn giá": [item ? item["Giá Bán"] : 0, Validators.required],
        "Số Lượng": [1, Validators.required],
        "Thành Tiền": [item ? item["Giá Bán"] : 0],
        "Đơn Vị Tính": [item ? item["Đơn Vị Tính"] : ""],
        "Sản Phẩm": [item ? item["Id"] : ""],
        "Đơn Hàng": this.formGroup.value["Id"],
        "Giá Nhập": [item ? item["Giá Nhập"] : 0, Validators.required],
      })
    );

    this.scrollTop();
  }
  onSelectedSanPham(event: any) {
    this.onAdd(event);
  }
  async onChecked(target: any) {
    this.chietKhauChecked = target.innerText;
    // const chietkhau = this.formGroup.value["Chiết Khấu"];//Chiết Khấu
    // if (target.innerText == "VND") {
    //   this.formGroup.value["Chiết Khấu"] = chietkhau / this.donvi;
    // }
    // this.formGroup.patchValue( this.formGroup.value);
    await this.onCal();
  }
  async onSubmit() {
    await this.onCal();
    console.log("submit");
    let values = this.formGroup.value as any;
    console.log(values);
    this.onUpdateForm();
    //1. kiem tra co san pham moi hay khong
    //2. kiem tra cap nhat san pham hay khong
    this.dataService.sendMessage({
      submit: { donhang: values, bulkDelete: this.removeAts },
    });
    return;

    //
    const updateOrCreateSanPhams = await this.checkProduct.isNewProduct(
      this.sanphams,
      values["chitiets"]
    );

    if (updateOrCreateSanPhams.length > 0) {
      let chitiets = values["chitiets"] as ChiTietDonHang[];

      for (let index = 0; index < chitiets.length; index++) {
        const sanpham = (updateOrCreateSanPhams as SanPham[]).find(
          (x: SanPham) => x["Id"] == chitiets[index]["Id"]
        );
        if (sanpham) {
          const chitiet = chitiets[index] as ChiTietDonHang;
          // chitiet["Đơn giá"] = sanpham["Giá Bán"];
          // chitiet["Tên Sản Phẩm"] = sanpham["Name"];
          // chitiet["Giá Nhập"] = sanpham["Giá Nhập"];
        }
      }
      await this.onCal();
      values["chitiets"] = chitiets;
      this.formGroup.patchValue(values);
    }

    const date = this.formGroup.value["Ngày Bán"];
    if (this.optionButtonUpdate) {
      this.serviceApi
        .put("donhang", [this.formGroup.value])
        .then(async (data: any) => {
          this.formGroup.value["chitiets"] = this.formGroup.value[
            "chitiets"
          ].map((x: any) => {
            x["Ngày"] = date;
            x["Đơn Hàng"] = data.data["Id"];
            return x;
          });
          this.formGroup.patchValue(this.formGroup.value);
          await this.addOrUpdateChitiets(date);
        });
      this.dataService.sendMessage({
        status: Status.Refesh,
        donhang: this.formGroup.value,
      });
    } else {
      this.serviceApi
        .post("donhang", [this.formGroup.value])
        .then(async (data: any) => {
          this.formGroup.value["chitiets"] = this.formGroup.value[
            "chitiets"
          ].map((x: any) => {
            x["Ngày"] = date;
            x["Đơn Hàng"] = data.data[0]["Id"];
            return x;
          });
          this.formGroup.patchValue(this.formGroup.value);
          await this.addOrUpdateChitiets(date);
          this.dataService.sendMessage({
            status: Status.Refesh,
            donhang: this.formGroup.value,
          });
        });
      this.dataService.sendMessage({ status: Status.Refesh });
    }

    // cap nhap don hang
    console.log("cap nhat don hang");
    // cap nhat chi tiet don hang
    this.dataService.sendMessage({
      status: Status.Refesh,
      donhang: this.formGroup.value,
    });
  }
  async addOrUpdateChitiets(date: Date) {
    const chitietsDH = this.formGroup.value["chitiets"];
    const url = "chitietdonhang";
    for (let i = 0; i < chitietsDH.length; i++) {
      chitietsDH[i]["Ngày"] = date;
      //console.log("id", chitietsDH[i]);
      if (chitietsDH[i]["Id"]) {
        // console.log("cap nhat");
        this.serviceApi.put(url, chitietsDH[i]);
      } else {
        //console.log("them moi");
        this.serviceApi.post(url, chitietsDH[i]);
      }
      await delay(200);
    }
  }
  onKeyUpCustomer(event: any) {
    let values = this.formGroup.value as DonHang;
    const khachHangs = this.khachhangs.find(
      (x: any) => x["Tên Khách Hàng"] == event.value
    );
    if (khachHangs) {
      values["Tên Khách Hàng"] = khachHangs["Tên Khách Hàng"];
      values["Khách Hàng"] = khachHangs["Id"];
      this.formGroup.patchValue(values);
    }
    if (!khachHangs) {
      const dialogRef = this.dialog.open(DialogCustomerComponent, {
        data: { "Tên Khách Hàng": event.value, Id: "" },
      });
      dialogRef.afterClosed().subscribe((khachhang: any) => {
        khachhang = khachhang.data[0];
        values["Tên Khách Hàng"] = khachhang["Tên Khách Hàng"];
        values["Khách Hàng"] = khachhang["Id"];
        this.formGroup.patchValue(values);
      });
    }
  }
  onChangeNgayBan(event: any) {
    console.log(event);
    const value = event.target.value;
    console.log("value", value);
    this.ngay = value;
  }
  trackByFn(index: any) {
    return index;
  }

  status = [
    {
      text: "Đặt Hàng",
      icon: "store_mall_directory",
      color: "#EF5350",
    },
    {
      text: "Đang Giao",
      icon: "local_shipping",
      color: "#AA00FF",
    },
    {
      text: "Hoàn Thành",
      icon: "done",
      color: "#021aee",
    },
    {
      text: "Đã Hủy",
      icon: "cancel",
      color: "#1A237E",
    },
  ];
  scrollTop() {
    setTimeout(() => {
      var element = document.getElementById("scrollTop");
      if (element) {
        // window.scrollTo(0, 0);
        element.scrollTo({ top: element.scrollHeight, behavior: "instant" });
      }
    }, 200);
  }
}
