import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicUpsertComponent } from 'src/app/Components/dynamic-upsert/dynamic-upsert.component';
import { Fields } from 'src/app/Models/field';
import { BaseApiUrl, fields } from 'src/app/general';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.scss']
})
export class DebtComponent {
  columns = ["name", "money", "status","loanDate","payDate"];
  columnDate = ["createdAt", "updatedAt"];
  options: any = {
    url: BaseApiUrl.ChiPhis,
    displayedColumns: ["no", ...this.columns],
    multi:true
  };
  fieldFilter: any;
  constructor(private dialog: MatDialog) {}
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
      money: ["", Validators.required],
      status: [""],
      loanDate: [new Date(), Validators.required],
      payDate:[],
      kh_ncc:['']
    };
    this.fieldFilter = (fields() as Fields[]).filter((x: any) =>
      this.columns.includes(x.field)
    );
    this.dialog.open(DynamicUpsertComponent, {
      data: { value: [], fields: this.fieldFilter, obj },
    });
  }
}
