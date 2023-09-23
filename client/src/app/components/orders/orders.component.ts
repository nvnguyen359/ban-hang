import { Component } from "@angular/core";
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
  constructor(private service: ApiService) {}

  ngOnInit() {
    this.getAll();
    this.isViewMmodule = localStorage.getItem(this.key) as unknown as boolean;
  }
  getAll() {
    this.service.get(BaseApiUrl.All).then((data: any) => {
      console.log("getAll", data);
      this.dataAll = data;
      if (data["sanphams"].length > 0) this.isShow = true;
    });
  }
  onEventView(event: boolean) {
    console.log(event);
    this.isViewMmodule = event;
    localStorage.setItem(this.key, `${event}`);
  }
}
