import { Component } from "@angular/core";
import { BaseApiUrl, Status, fields } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { UpsertCustomerComponent } from "./upsert-customer/upsert-customer.component";
import { DynamicUpsertComponent } from "src/app/Components/dynamic-upsert/dynamic-upsert.component";
import { Fields } from "src/app/Models/field";
import { DataService } from "src/app/services/data.service";
import { Validators } from "@angular/forms";
@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent {
  columns = ["name", "phone", "address", "email"];
  columnDate = ["createdAt", "updatedAt"];
  options: any = {
    url: BaseApiUrl.KhachHangs,
    displayedColumns: ["no", ...this.columns],
  };
  fieldFilter: any;
  constructor(private dialog: MatDialog, private dataService: DataService) {}
  ngOnInit() {
    this.fieldFilter = (fields() as Fields[]).filter((x: Fields) =>
      this.columns.concat(this.columnDate).includes(x.field)
    );
  }
  onUpsert(value: any) {
    const fieldFilter = this.fieldFilter.map((x: Fields) => {
      if (x.field == "createdAt") {
        x.type = "hidden";
      }
      if (x.field == "updatedAt") {
        x.type = "hidden";
      }
      return x;
    });
    this.dialog.open(DynamicUpsertComponent, {
      data: { value, fields: fieldFilter },
    });
  }
  onCreate() {
    const obj = {
      id: "",
      name: ["", Validators.required],
      phone: ["", Validators.required],
      address: [""],
      email: "",
    };
    this.fieldFilter = (fields() as Fields[]).filter((x: any) =>
      this.columns.includes(x.field)
    );
    this.dialog.open(DynamicUpsertComponent, {
      data: { value: [], fields: this.fieldFilter, obj },
    });
  }
}
