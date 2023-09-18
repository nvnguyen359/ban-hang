import { Component, ElementRef, Inject } from "@angular/core";
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
import { delay } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import "../../lib.extensions";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import {CheckProduct} from './CheckProduct'
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
  providers:[CheckProduct]
})
export class ProductArrayComponent {
  chekProduct:any ;
  danhsachTenSanPham: any = [];
  sanphams: any;
  initSanpham?: SanPham;
  donhang: any;

  khachhangs?: any;
  formGroup?: any = this.fb.group({
    "Tên Khách Hàng": ["", Validators.required],
    "Tiền Công": [""],
    "Phí Ship": [""],
    "Trạng Thái": [""],
    "Thành Tiền": [""],
    "Ngày Bán": [new Date().toLocaleDateString(), Validators.required],
    chitiets: this.fb.array([]),
  });

  chitietsDonHangs?: any = [];
  keysChitiet: any = [];
  showKeys: any = [];
  isDonHang: boolean = false;
  title: string = "";
  chietkhau=0;
  constructor(
    private fb: FormBuilder,
    private serviceApi: ApiService,
    private dialog: MatDialog,
    private checkProduct:CheckProduct,
    @Inject(MAT_DIALOG_DATA) public data: any,
   
  ) {
   // this.getSanPhams();
   this.sanphams= data['sanphams'].filter((sp: any) => !this.danhsachTenSanPham.includes(sp["Name"]));;
  }

  async switchCase() {
    // ['donhang', 'isDonhang', 'khachhangs']
    const keys = Object.keys(this.data);
    if (keys.includes("donhang")) {
      this.isDonHang = true;
      this.donhang = this.data["donhang"]["donhang"] as DonHang;
      this.chitietsDonHangs = this.donhang["chitiets"];
      this.danhsachTenSanPham = this.chitietsDonHangs.map(
        (x: any) => x["Tên Sản Phẩm"]
      );

      this.keysChitiet = Object.keys(this.chitietsDonHangs[0]);

      this.showKeys = ["Id", "Tên Sản Phẩm", "Đơn giá", "Số Lượng"];
      if (this.data["isDonhang"] && this.donhang["chitiets"].length > 0)
        this.title = `Cập Nhật Đơn Hàng <b>${this.donhang["Id"]}</b>`;
      await this.initDonHang();
    }
  }
  //  getSanPhams() {
  //   this.serviceApi.get("sanpham").then((sanphams:any)=>{
  //     this.sanphams = (
  //       (sanphams ) as SanPham[]
  //     ).filter((sp: any) => !this.danhsachTenSanPham.includes(sp["Name"]));
  //   })
   
  // }

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
      chitiets: formArray,
    });
  }

  async ngOnInit() {
    await this.switchCase();
    //await this.getSanPhams();
    //await this.checkEvent();

    this.khachhangs = this.data["khachhangs"] as KhachHang[];
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

  onChangeValue(event?: any) {
    let values = this.formGroup.value;

    let chitiets = Array.from(values["chitiets"]);
    chitiets = chitiets.map((e: any) => {
      e["Thành Tiền"] = parseInt(e["Đơn giá"]) * parseInt(e["Số Lượng"]);
      return e;
    });
    try {
      const tenSp = event.value;
      console.log(
        JSON.stringify(
          this.formGroup.value["chitiets"].map((x: any) => x["Tên Sản Phẩm"])
        )
      );
      const checkSps = Array.from(
        this.formGroup.value["chitiets"].map((x: any) => x["Tên Sản Phẩm"])
      ).filter((x: any) => x == tenSp);
      console.log(checkSps); //Vỏ Hitachi 14v
      if (checkSps.length > 1) {
        this.dialog.open(DialogConfirmComponent, {
          data: {
            title: `${tenSp} đã có trong danh sách`,
            header: "Cảnh Báo!",
          },
        });
        event.value = "";
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
          }
        });
      }
    } catch (error) {}
    values["chitiets"] = chitiets;

   // console.log(values);
    this.formGroup.patchValue(values);
  }
  onCal(donhang: DonHang) {
    const chitiets = donhang["chitiets"];

    const sumSoLuong = chitiets
      .map((a: any) => a["Số Lượng"])
      .reduce((a: number, b: number) => a + b, 0);
    const sumThanhTien = chitiets
      .map((a: any) => a["Thành Tiền"])
      .reduce((a: number, b: number) => a + b, 0);
  }

  onDelete(index: number) {
    this.formGroup.controls["chitiets"].removeAt(index);
  }
  onAdd(item?:any) {
    const arr = this.formGroup.controls["chitiets"] as FormArray;
    arr.push(
      this.fb.group({
        Id: "",
        "Tên Sản Phẩm": [item?item['Name'] :"", Validators.required],
        "Đơn giá": [item?item['Giá Bán'] :0, Validators.required],
        "Số Lượng": [0, Validators.required],
        "Thành Tiền": [0],
        "Đơn Vị Tính": "",
      })
    );
    this.scrollTop();
  }
  onSelectedSanPham(event:any){
    this.onAdd(event)
  }
  onChecked(target:any) {
    console.log('checked',target.innerText)
  }
  onSubmit() {
    let values = this.formGroup.value;
    console.log(values);
    //1. kiem tra co san pham moi hay khong

    this.checkProduct.setSProducts =this.sanphams;
    this.checkProduct.isNewProduct(this.sanphams,values['chitiets'])
    //2. kiem tra cap nhat san pham hay khong
    // cap nhap don hang
    // cap nhat chi tiet don hang

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
