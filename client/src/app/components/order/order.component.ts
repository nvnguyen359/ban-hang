import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { DonHang } from "src/app/Models/donHang";
import { KhachHang } from "src/app/Models/khachHangs";
import { SanPham } from "src/app/Models/sanPham";
import { ApiService } from "src/app/services/api.service";
import { ThermalPrinterServiceService } from "src/app/services/thermal-printer-service.service";
declare var capitalizeFirstLetter: any;
declare var removeAccents: any;
import { Status } from "./../../general";
import { DataService } from "src/app/services/data.service";
@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent {
  ngay = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  checkDk: any = false;
  tiencong!: number;
  phiship!: number;
  giamgia!: number;
  selectDv = 1000;
  sumEnd: any;
  groupGiamgia: any = "vnd";
  products: SanPham[] = [];
  filterProducts: SanPham[] = [];
  orders: any;
  groups: any = [];
  obj?: SanPham;
  khachhangs: KhachHang[] = [];
  khach?: any;
  filteredOptions!: Observable<string[]>;
  optionsKhs = {
    showtext: "Tên Khách Hàng",
    label: "Khách Hàng",
    placeholder: "Tên Khách Hàng",
  };
  donhang?: DonHang;
  flag = false;
  codeSp: any;
  constructor(
    private service: ApiService,
    private printer: ThermalPrinterServiceService,
    private dataService: DataService
  ) {
    localStorage.setItem("sp", "");
  }
  jsRun() {
    var btns = document.querySelectorAll(".btns-left  .btn-left");
    btns.forEach((btn, index) => {
      if (btn.textContent == "Tất Cả") {
        btn.classList.add("active");
      }
      if (btn) {
        btn.addEventListener("click", () => {
          let btns = document.querySelectorAll(".btns-left  .btn-left");
          btns.forEach((btn) => {
            btn.classList.remove("active");
          });
          btn.classList.add("active");
        });
      }
    });
  }
  ngOnInit() {
    this.getProducts();
    this.getKhachHang();
    this.selectDv = 1000;
  }
  onSelected(value: any) {
    console.log(value);
    const sp = value as SanPham;
    this.filterProducts = this.products.filter((x: any) =>
      removeAccents(x["Name"].toLowerCase()).includes(
        removeAccents(sp["Name"]).toLowerCase()
      )
    );
  }
  onKeyupSanPham(value: any) {
    this.filterProducts = this.products.filter((x: any) =>
      removeAccents(x["Name"].toLowerCase()).includes(
        removeAccents(value).toLowerCase()
      )
    );
  }
  onSelectedKh(value: any) {
    this.khach = value;
    this.onCal();
    //console.log(value);
  }
  getProducts() {
    this.service.get("sanpham").then((e: any) => {
      if (!e) return;
      const products = (Array.from(e) as SanPham[]).map((x: any) => {
        x["Số Lượng"] = 0;
        x["Giá Bán"] = parseInt(`${x["Giá Bán"]}`.replace(".", ""));
        x["Giá Nhập"] = parseInt(`${x["Giá Nhập"]}`.replace(".", ""));
        x["Đơn giá"] = x["Giá Bán"];
        (x["Tên Sản Phẩm"] = x["Name"]), (x["Sản Phẩm"] = x["Id"]);
        return x;
      });
      this.products = products;
      this.filterProducts = products;
console.log(products)
      const groups = [
        ...new Set(
          products.map((x) => {if(x['Name']){ return capitalizeFirstLetter(x["Name"]?.split(" ")[0])}})
        ),
      ];
      this.groups = ["Tất Cả", ...groups.sort()];
      if (groups.length > 1) {
        setTimeout(() => {
          this.jsRun();
        }, 100);
      }
    });
  }
  getKhachHang() {
    this.service.get("khachhang").then((khs: any) => {
      this.khachhangs = khs as KhachHang[];
    });
  }
  onClick(item: any) {
    this.filterProducts =
      item != "Tất Cả"
        ? this.products.filter((x) => x["Name"]?.includes(item))
        : this.products;
  }
  onClickSanPham(item: SanPham, event: any) {
    const ev = event as PointerEvent;
    var rect = event.target.getBoundingClientRect();
    const midle = rect.left + rect.width / 2;
    this.products.forEach((x: SanPham) => {
      if (x["Id"] == item["Id"]) {
        x["Số Lượng"] =
          event.clientX - midle < 0 ? x["Số Lượng"] - 1 : x["Số Lượng"] + 1;
        if (x["Số Lượng"] < 0) x["Số Lượng"] = 0;
        return;
      }
    });

    this.orders = this.products.filter((x) => x["Số Lượng"] > 0);
    this.onCal();
  }
  onCal() {
    if(!this.orders) return;
    this.checkDk = this.khach && this.orders.length > 0;
    if (this.orders.length < 1) return;
    const tiencong = this.tiencong * this.selectDv || 0;
    const phiship = this.phiship * this.selectDv || 0;
    const tt = Array.from(
      this.orders.map(
        (x: any) => x["Số Lượng"] * parseInt(`${x["Giá Bán"]}`.replace(".", ""))
      )
    ).reduce((a: any, b: any) => a + b, 0) as Number;

    const sumCount = Array.from(
      this.orders.map((x: SanPham) => x["Số Lượng"])
    ).reduce((a: any, b: any) => a + b, 0);
    const giamgia =
      (this.groupGiamgia == "vnd"
        ? this.giamgia * this.selectDv
        : (parseInt(tt.toString()) * this.giamgia) / 100) || 0;
    this.sumEnd = {
      tiencong,
      phiship,
      tt,
      sumCount,
      giamgia,
      thanhtoan: parseInt(tt.toString()) + tiencong + phiship - giamgia,
    };
  }

  keyPress(event: KeyboardEvent, item: SanPham) {
    this.obj = item;
    const pattern = /[0-9]/;
    if (!this.obj) return;
    const sp = localStorage.getItem("sp");
    console.log("sp", sp, item["Id"]);
    const inputChar = event.key;
    console.log("inputChar ", inputChar);
    if (sp == item["Id"]) {
      this.codeSp += inputChar;

      this.obj["Số Lượng"] = parseInt(this.codeSp);
    } else {
      localStorage.setItem("sp", `${item["Id"]}`);
      this.codeSp = inputChar;
    }
    this.onCal();
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  onSubmit() {
    this.onSave();
  }
  async onSave() {
    let donhang: DonHang = {
      Id: "",
      "Khách Hàng": this.khach?.Id,
      "Tên Khách Hàng": this.khach?.["Tên Khách Hàng"],
      "Phí Ship": this.sumEnd.phiship,
      "Tiền Công": this.sumEnd.tiencong,
      "Giảm Giá": this.sumEnd.giamgia,
      "Thanh Toán": this.sumEnd.thanhtoan,
      "Thành Tiền": this.sumEnd.tt,
      "Số Lượng": this.sumEnd.sumCount,
      "Ngày Bán": this.ngay.value?.toLocaleDateString(),
    } as DonHang;

    const result = (await this.service.post("donhang", donhang)) as DonHang[];

    let chitiet = Array.from(this.orders).map((x: any) => {
      x["Đơn Hàng"] = (result as DonHang[])[0].Id;
      x["Thành Tiền"] = parseInt(x["Số Lượng"]) * parseInt(x["Đơn giá"]);
      x["Ngày"] = this.ngay.value?.toLocaleDateString("vi");
      return x;
    });

    const resultChitiet = await this.service.post("chitietdonhang", chitiet);

    result[0].chitiets = resultChitiet;
    donhang["chitiets"] = chitiet;
    this.donhang = donhang;
    this.dataService.sendMessage({ add: Status.Add, donhang: result[0] });
    return result[0];
  }
  async onSavePrint() {
    await this.onSave();
    await this.printer.print(this.donhang);
  }
  onReset() {
    this.orders = new Array();
    this.onCal();
  }
}
