import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Product } from "src/app/Models/product";
import { BaseApiUrl, Status, fields } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import { DynamicUpsertComponent } from "../dynamic-upsert/dynamic-upsert.component";
import { Validators } from "@angular/forms";
import { Fields } from "src/app/Models/field";

declare var capitalizeFirstLetter: any;
declare var removeAccents: any;
@Component({
  selector: "app-order-grid",
  templateUrl: "./order-grid.component.html",
  styleUrls: ["./order-grid.component.scss"],
})
export class OrderGridComponent {
  @Input() inputData: any;
  @Output() selectOrder = new EventEmitter();
  categories: any = [];
  customers: any = [];
  orders: any = [];
  groups: any = [];
  filterProducts: any = [];
  obj?: Product;
  codeSp: any;
  constructor(private dataService: DataService, private dialog: MatDialog) {}
  ngAfterViewInit(): void {
    this.jsRun();
  }

  ngOnInit() {
    this.categories = this.inputData.products;
    this.filterProducts = this.categories;
    this.customers = this.inputData.cusomers;
    const groups = [
      ...new Set(
        this.categories.map((x: Product) => {
          if (x.name) {
            return capitalizeFirstLetter(x.name?.split(" ")[0]);
          }
        })
      ),
    ];
    this.groups = ["Tất Cả", ...groups.sort()];

    this.onShowUpdate();
    this.onOrder();
  }

  onShowUpdate() {
    const order = this.inputData?.order;
    const details = order?.details;

    if (!details) {
      this.orders = [];
      return;
    }
    // console.log('details',details.map((x:any)=>x.productId))
    // console.log(this.categories.map((x:any)=>x.id))
    details.forEach((item: any) => {
      console.log(item);
      this.categories = this.categories.map((x: any) => {
        if (parseInt(x.id) == parseInt(item.productId)) {
          x.quantity = item.quantity;
          x.price = item.price;
          x.detailsId = item.id;
        }
        return x;
      });
    });

    //this.categories =Array.from(this.categories).sort((a:any,b:any)=>b.quantity-a.quantity)
    // console.log(this.categories.map((x: any) => x.quantity));
  }
  sort(array: any = []): any[] {
    return Array.from(array).sort((a: any, b: any) => b.quantity - a.quantity);
  }
  onClickCategory(item: any, event: any) {
    var rect = event.target.getBoundingClientRect();
    const midle = rect.left + rect.width / 2;
    this.categories.forEach((x: Product) => {
      if (x.id == item.id) {
        x.quantity =
          event.clientX - midle < 0 ? x.quantity - 1 : x.quantity + 1;
        if (x.quantity < 0) x.quantity = 0;
        return;
      }
    });

    this.onOrder();
  }
  onOrder() {
    this.orders = this.categories.filter((x: any) => x.quantity > 0);
    // console.log("emit",this.orders);
    this.selectOrder.emit(this.orders);
  }
  keyPressCategory(event: KeyboardEvent, item: any) {
    this.obj = item;
    const pattern = /[0-9]/;
    if (!this.obj) return;
    let sp = localStorage.getItem("sp") || 0;
    // console.log("sp", sp, item.id);
    const inputChar = event.key;
    //  console.log("inputChar ", inputChar);
    if (sp == item.id) {
      this.codeSp += inputChar;

      this.obj.quantity = parseInt(this.codeSp);
    } else {
      localStorage.setItem("sp", `${item.id}`);
      this.codeSp = inputChar;
    }
    this.orders = this.categories.map((x: any) => {
      if (x.id == this.obj?.id) {
        x.quantity = this.obj?.quantity;
        return x;
      }
    });
    this.onOrder();
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  onClick(item: any) {
    this.filterProducts =
      item != "Tất Cả"
        ? this.categories.filter((x: any) =>
            removeAccents(x["name"]?.toLocaleLowerCase()).includes(
              removeAccents(item.toLocaleLowerCase())
            )
          )
        : this.categories;
  }
  onSelected(event: any) {
    this.filterProducts = this.categories
      .filter((x: any) => x["name"]?.includes(event.name))
      .map((a: any) => {
        a.quantity = 1;
        return a;
      });
    this.onOrder();
  }
  onKeyUpProduct(event: any) {
    this.filterProducts = this.categories.filter((x: any) =>
      `${x.name}`.removeAccents().includes(`${event}`.removeAccents())
    );
    if (this.filterProducts.length < 1) this.filterProducts = this.categories;
    this.onOrder();
  }
  addNewProduct() {
    const columns = ["name", "importPrice", "price", "unit"];
    const obj = {
      id: "",
      name: ["", Validators.required],
      importPrice: ["", Validators.required],
      price: ["", Validators.required],
      unit: ["", Validators.required],
    };
    const fieldFilter = (fields() as Fields[]).filter((x: any) =>
      columns.includes(x.field)
    );
    const dialogRef = this.dialog.open(DynamicUpsertComponent, {
      data: {
        value: [],
        fields: fieldFilter,
        obj,
        numberRow: 1,
        url: BaseApiUrl.SanpPhams,
      },
    });
    if (dialogRef.afterClosed()) {
      this.dataService.currentMessage.subscribe((e: any) => {
        if (Status.Add == e.status && e.url == BaseApiUrl.SanpPhams) {
          const el = e.data.result[0];
          this.categories = [el, ...this.categories];
          this.categories = Array.from(this.categories).map((x: any) => {
            if (x.id === el.id) {
              x.quantity = 1;
            }
            return x;
          });
          this.filterProducts = this.categories;
          this.onOrder();
        }
      });
    }
  }
  jsRun() {
    const els = `.groups .btn-left`;
    var btns = document.querySelectorAll(els);
    btns[0].classList.add("active");
    btns.forEach((btn, index) => {
      if (btn.textContent == "Tất Cả") {
        btn.classList.add("active");
      }
      if (btn) {
        btn.addEventListener("click", () => {
          let btns = document.querySelectorAll(els);
          btns.forEach((btn) => {
            btn.classList.remove("active");
          });
          btn.classList.add("active");
        });
      }
    });
  }
  ngClassSelect(quantity: number) {
    return quantity > 0 ? "btn-select" : "";
  }

  onDeleteDetails(item: any) {
    const id = item.detailsId;
    this.dataService.sendMessage({ delDetails: id });
    this.categories = this.categories.map((x: any) => {
      if (x.id == item.id) {
        x.quantity = 0;
      }
      return x;
    });
  }
}
