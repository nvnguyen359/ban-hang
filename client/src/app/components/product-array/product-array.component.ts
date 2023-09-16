import { Component, Inject } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { async } from "rxjs";
import { ChiTiet, ChiTietDonHang } from "src/app/Models/chiTietDonHang";
import { DonHang } from "src/app/Models/donHang";
import { KhachHang } from "src/app/Models/khachHangs";
import { SanPham } from "src/app/Models/sanPham";
import { delay } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import "../../lib.extensions";
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
})
export class ProductArrayComponent {
  sanphams: any;
  initSanpham?: SanPham;
  donhang: any;

  khachhangs?: any;
  options = {
    showtext: "Name",
  };
  optionsKhs: any = {
    showtext: "Tên Khách Hàng",
    label: "Khách Hàng",
    placeholder: "Tên Khách Hàng",
  };

  formGroup?: any = this.fb.group({
    "Tên Khách Hàng": ["", Validators.required],
    "Tiền Công": [""],
    "Phí Ship": [""],
    "Trạng Thái": [""],
    "Thành Tiền": [""],
    "Ngày Bán": [new Date().toLocaleDateString(), Validators.required],
    chitietsArray: this.fb.array([]),
  });

  chitietsArray?: FormArray;
  chitietsDonHangs?: any = [];
  keysChitiet: any = [];
  showKeys: any = [];
  isDonHang: boolean = false;
  title: string = "";
  constructor(
    private fb: FormBuilder,
    private serviceApi: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async switchCase() {
    // ['donhang', 'isDonhang', 'khachhangs']
    const keys = Object.keys(this.data);
    if (keys.includes("donhang")) {
      this.isDonHang = true;
      this.donhang = this.data["donhang"]["donhang"] as DonHang;
      this.chitietsDonHangs = this.donhang["chitiets"];
      this.keysChitiet = Object.keys(this.chitietsDonHangs[0]);
      console.log(this.keysChitiet);
      this.showKeys = ["Id", "Tên Sản Phẩm", "Đơn giá", "Số Lượng"];
      if (this.data["isDonhang"] && this.donhang["chitiets"].length > 0)
        this.title = `Cập Nhật Đơn Hàng ${this.donhang["Id"]}`;
      await this.initDonHang();
    }
  }
  async getSanPhams() {
    this.sanphams = await this.serviceApi.get("sanpham");
  }
  async initDonHang() {
    const dh = this.donhang;
    console.log(dh);
    const formArray = this.fb.array([]) as FormArray;
    const chitiets = dh["chitiets"] as ChiTiet[];
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
      "Tên Khách Hàng": [
        dh ? dh["Tên Khách Hàng"] : "" || "",
        Validators.required,
      ],
      "Tiền Công": [dh ? dh["Tiền Công"] : "" || ""],
      "Phí Ship": [dh ? dh["Phí Ship"] : "" || ""],
      "Trạng Thái": [dh ? dh["Trạng Thái"] : "" || ""],
      "Thành Tiền": [dh ? dh["Thành Tiền"] : "" || ""],
      "Ngày Bán": [
        dh
          ? `${dh["Ngày Bán"]}`.convertDateVNToISO(true)
          : "" || new Date().toLocaleDateString(),
        Validators.required,
      ],
      chitietsArray: formArray,
    });
  }

  async ngOnInit() {
    console.log(this.data);
    await this.checkEvent();
    await this.switchCase();
    this.khachhangs = this.data["khachhangs"] as KhachHang[];
    await this.getSanPhams();
  }
  async checkEvent() {
    if (this.data["isDonhang"]) {
      this.donhang = this.data["donhang"]["donhang"] as DonHang;
      console.log(this.donhang);
    }
  }

  isNumeric(str?: any) {
    if (typeof str != "string") return false; // we only process strings!
    return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
  }

  onChangeValue() {
    const values = this.formGroup.value;
    console.log(values);
  }
  onDelete(index: number) {
    this.formGroup.controls["chitietsArray"].removeAt(index);
  }
  onAdd() {
   const arr= this.formGroup.controls["chitietsArray"] as FormArray
   arr.push(this.fb.group({
    'Id':'',
    'Tên Sản Phẩm':[''],
    'Đơn giá':0,
    'Số Lượng':0,
    'Thành Tiền':[0]
   }))
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
}
