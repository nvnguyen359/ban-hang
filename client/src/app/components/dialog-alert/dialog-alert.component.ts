import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-alert",
  templateUrl: "./dialog-alert.component.html",
  styleUrls: ["./dialog-alert.component.scss"],
})
export class DialogAlertComponent {
  title = ` Bạn chắc chắn muốn xóa!`;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) this.title = data;
  }
}
