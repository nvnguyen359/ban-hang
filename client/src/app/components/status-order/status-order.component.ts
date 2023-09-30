import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-status-order",
  templateUrl: "./status-order.component.html",
  styleUrls: ["./status-order.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatusOrderComponent),
      multi: true,
    },
  ],
})
export class StatusOrderComponent {
  @Input() statusText!:any;

  @Output() eventChange = new EventEmitter();
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

  _trangthai = this.statusText;

  constructor() {}

  ngOnInit() {
    console.log(this.trangthai)
  }

  get trangthai(): string {
    return this._trangthai;
  }

  set trangthai(value: string) {
    this._trangthai = value;
    this.propagateChange(this._trangthai);
  }

  writeValue(value: string) {
    if (value !== undefined) {
      this.trangthai = value;
    }
  }

  propagateChange = (_: any) => {};
  propagateTouched = (_: any) => {};

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.propagateTouched = fn;
  }

  touched($event: any) {
    this.propagateTouched($event);
  }
  onChange(event: any) {
    const value = event.value;
    this.eventChange.emit(value);
  }
}
