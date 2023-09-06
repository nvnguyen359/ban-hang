import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { KhachHang } from "src/app/Models/khachHangs";
import { SanPham } from "src/app/Models/sanPham";
import { ApiService } from "src/app/services/api.service";
declare var capitalizeFirstLetter: any;
declare var removeAccents: any;
@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent {
  products: SanPham[] = [];
  filterProducts: SanPham[] = [];
  orders: any;
  groups: any = [];
  obj?: SanPham;
  khachhangs: KhachHang[] = [];
  filteredOptions!: Observable<string[]>;
  optionsKhs = {
    showtext: "Tên Khách Hàng",
    label: "Khách Hàng",
    placeholder: "Tên Khách Hàng",
  };
  constructor(private service: ApiService) {}
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
    console.log(value);
  }
  getProducts() {
    this.service.get("sanpham").then((e: any) => {
      if(!e) return;
      const products = (e as SanPham[]).map((x: any) => {
        x.count = 0;
        x["Giá Bán"] = parseInt(`${x["Giá Bán"]}`.replace(".", ""));
        x["Giá Nhập"] = parseInt(`${x["Giá Nhập"]}`.replace(".", ""));
        return x;
      });
      this.products = products;
      this.filterProducts = products;

      const groups = [
        ...new Set(
          products.map((x) => capitalizeFirstLetter(x["Name"]?.split(" ")[0]))
        ),
      ];
      this.groups = ["Tất Cả", ...groups.sort()];
      console.log(groups.length)
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
        x["count"] =
          event.clientX - midle < 0 ? x["count"] - 1 : x["count"] + 1;
        if (x["count"] < 0) x["count"] = 0;
        return;
      }
    });

    this.orders = this.products.filter((x) => x["count"] > 0);
  }
  keyPress(event: KeyboardEvent, item: SanPham) {
    this.obj = item;
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!this.obj) return;
    this.obj["count"] = parseInt(`${this.obj["count"]}${inputChar}`);
    console.log(this.obj);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
}
