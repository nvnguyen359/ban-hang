import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "src/app/Models/product";
import { BaseApiUrl, fields } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { UpsertCustomerComponent } from "../customers/upsert-customer/upsert-customer.component";
import { Fields } from "src/app/Models/field";
import { DynamicUpsertComponent } from "src/app/Components/dynamic-upsert/dynamic-upsert.component";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent {
  columns = ["name", "importPrice", "price", "unit", "createdAt"];
  columnDate = ["updatedAt"];
  options: any = {
    displayedColumns: ["no", ...this.columns],
  };
  fieldFilter: any;
  constructor(
    private service: ApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}
  onUpsert(event: any) {
    console.log(event);
    const fieldFilter = (fields() as Fields[])
      .filter((x: Fields) =>
        this.columns.concat(this.columnDate).includes(x.field)
      )
      .map((x: Fields) => {
        if (x.field == "createdAt") {
          x.type = "hidden";
        }
        if (x.field == "updatedAt") {
          x.type = "hidden";
        }
        return x;
      });
    this.dialog.open(DynamicUpsertComponent, {
      data: { value: event, fields: fieldFilter },
    });
  }
  onCreate() {
    this.columns = ["name", "importPrice", "price", "unit"]
    const obj = {
      id: "",
      name: ["", Validators.required],
      importPrice: ["", Validators.required],
      price: ["", Validators.required],
      unit: ["", Validators.required],
    };
    this.fieldFilter = (fields() as Fields[]).filter((x: any) =>
      this.columns.includes(x.field)
    );
    this.dialog.open(DynamicUpsertComponent, {
      data: { value: [], fields: this.fieldFilter, obj },
    });
  }
  ngAfterViewInit() {}
}
