import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicUpsertComponent } from 'src/app/Components/dynamic-upsert/dynamic-upsert.component';
import { Fields } from 'src/app/Models/field';
import { BaseApiUrl, fields } from 'src/app/general';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-import-goods',
  templateUrl: './import-goods.component.html',
  styleUrls: ['./import-goods.component.scss']
})
export class ImportGoodsComponent {
  columns = ["name", "quantity", "unit","importPrice","price","intoMoney"];
  columnDate = ["updatedAt"];
  options: any = {
    multi:true,
    displayedColumns: ["no", ...this.columns,"createdAt"],
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
      if (x.field == "productId") {
        x.type = "hidden";
      }
      if (x.field == "updatedAt") {
        x.type = "hidden";
      }
      if (x.field == "productId") {
        x.type = "hidden";
      }
      if (x.field == "intoMoney") {
        x.type = "hidden";
      }
      return x;
    });
    console.log(value)
    this.dialog.open(DynamicUpsertComponent, {
      data: { value, fields: fieldFilter },
    });
  }
  onCreate() {
    const obj = {
      id: "",
      name: ["", Validators.required],
      quantity: ["", Validators.required],
      unit: [""],
      importPrice: ["", Validators.required],
      price: ["", Validators.required],
      productId:'',
      intoMoney:0
    };
    this.fieldFilter = (fields() as Fields[]).filter((x: any) =>
      this.columns.includes(x.field)
    );
    this.dialog.open(DynamicUpsertComponent, {
      data: { value: [], fields: this.fieldFilter, obj },
    });
  }
}
