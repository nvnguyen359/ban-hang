import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-order-upsert",
  templateUrl: "./order-upsert.component.html",
  styleUrls: ["./order-upsert.component.scss"],
})
export class OrderUpsertComponent {
  first = "Tạo Đơn Hàng Mới Nhanh";
  second = "Tạo Đơn Hàng Mới";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService
  ) {}
  ngOnInit() {
   // console.log(this.data);
  }
  ngAfterViewInit(): void {}
  onOrder(details: any) {
    this.dataService.sendMessage({ details });
  }
}
