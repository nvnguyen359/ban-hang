import { NgFor } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from "@angular/core";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
  standalone: true,
  imports: [MatSelectModule, MatIconModule, MatOptionModule, NgFor],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class StatusComponent {
  @Input() statusText = "";
  @Output() eventChange = new EventEmitter();
  color: any = "";
  constructor() {
    this.color = this.status.find((x) => x.text == this.statusText)?.color;
  }
  ngOnInit(){
    this.color = this.status.find((x) => x.text == this.statusText)?.color;
  }
  setColor(){
    return  this.status.find((x) => x.text == this.statusText)?.color;
  }
  onChange(event: any) {
  
    this.color = this.status.find((x) => x.text == event.value)?.color;
    this.eventChange.emit(event);
  }
  status = [
    {
      text: "Đặt Hàng",
      icon: "store_mall_directory",
      color: "#EF5350",
    },
    {
      text: "Đang Giao",
      icon: "local_shipping",
      color: "#AA00FF",
    },
    {
      text: "Hoàn Thành",
      icon: "done",
      color: "#021aee",
    },
    {
      text: "Đã Hủy",
      icon: "cancel",
      color: "#1A237E",
    },
  ];
}
