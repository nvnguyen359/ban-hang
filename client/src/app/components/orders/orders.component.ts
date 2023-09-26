import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BaseApiUrl } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent {
  isViewMmodule: any = false;
  key = "isViewMmodule";
  dataAll: any;
  isShow: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataAll = data;
  }

  ngOnInit() {
    this.isViewMmodule = localStorage.getItem(this.key) == "true";
  }

  onEventView(event: boolean) {
    this.isViewMmodule = event==true;
    localStorage.setItem(this.key, `${event}`);
  }
}
