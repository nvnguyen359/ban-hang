import { Component } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Order } from "src/app/Models/order";
import { OrderDetails } from "src/app/Models/orderDetails";
import {
  firstLastDate,
  BaseApiUrl,
  firstlastMonth,
  getQuarter,
  getStartEndMonthInQuarter,
  getStarEndDateInQuarter,
} from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import { Details } from "src/app/services/print-html.service";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent {
  firstDay: Date = new Date();
  lastDay: Date = new Date();
  thangs: any[] = [];
  quis: any[] = [];
  nams: any[] = [];

  donhangs: any;
  tongDon: number = 0;
  tongDoanhThu: number = 0;
  tongChietKhau: number = 0;
  filterOrder: any;
  overviews: any[] = [
    { title: "Đơn hàng", sum: 0 },
    { title: "Doanh Thu", sum: 0 },
    { title: "Chiết Khấu", sum: 0 },
    { title: "Lợi Nhuận", sum: 0 },
  ];
  chitiets: any[] = [];
  filterChiTiets: any[] = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  title = `Ngày ${new Date().toLocaleDateString("vi")}`;
  constructor(private service: ApiService, private dataService: DataService) {
    const date = firstLastDate();
    this.firstDay = date.firstDate;
    this.lastDay = date.lastDate;
    this.title = `Ngày ${new Date().toLocaleDateString("vi")}`;
  }
  async ngOnInit() {
    this.getMonths();
    this.getQuanter();
    this.getYears();
    //this.getAll();
    this.getDonhangs();
  }
  //#region all
  getMonths() {
    for (let i = 1; i < 13; i++) {
      this.thangs.push("Tháng " + i);
    }
  }
  getQuanter() {
    for (let i = 1; i < 5; i++) {
      this.quis.push("Quí " + i);
    }
  }
  getYears() {
    for (let i = new Date().getFullYear(); i > 2022; i--) {
      this.nams.push("Năm " + i);
    }
  }
  //#endregion
  getAll() {}
  getDonhangs(obj: any = null) {
    if (!obj)
      obj = {
        pageSize: 10000,
        page: 0,
        startDay: new Date(),
        endDay: new Date(),
      };
    this.service.get(BaseApiUrl.Orders, obj).then((e: any) => {
      this.donhangs = e.items;
      console.log(this.donhangs)
      this.filterOrders();
    });
  }
  onClosedMenu(event: any = null) {
    const now = new Date();
    const y = now.getFullYear();
    const today = now.firstLastDate();
    if (!event) {
      this.firstDay = today.firstDate;
      this.lastDay = today.lastDate;
      this.title = `Ngày ${this.firstDay.toLocaleDateString("vi")}`;
    }
    if (`${event}`.includes("Tháng")) {
      const m = parseInt(`${event}`.replace("Tháng", "").trim());
      const mount = firstlastMonth(y, m - 1);
      this.firstDay = mount.firstDay;
      this.lastDay = mount.lastDay;
      this.title = `Tháng ${
        this.firstDay.getMonth() + 1
      }/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes("thangnay")) {
      const m = new Date().getMonth();
      const mount = firstlastMonth(y, m);
      this.firstDay = mount.firstDay;
      this.lastDay = mount.lastDay;
      this.title = `Tháng ${
        this.firstDay.getMonth() + 1
      }/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes("quinay")) {
      const m = getQuarter(new Date());
      const quarter = getStartEndMonthInQuarter();
      this.firstDay = quarter.firsDate;
      this.lastDay = quarter.lastDate;
      this.title = `Quí ${m}/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes("Quí")) {
      const m = parseInt(`${event}`.replace("Quí", "").trim());
      const quarter = getStarEndDateInQuarter(m, y);
      this.firstDay = quarter.firstDate;
      this.lastDay = quarter.lastDate;
      this.title = `Quí ${m}/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes("năm")) {
      this.firstDay = new Date(y, 0, 1);
      this.lastDay = new Date(y, 11, 31, 23, 59, 59, 999);
      this.title = `Năm ${this.lastDay.getFullYear()}`;
    }
    const obj = {
      pageSize: 10000,
      page: 0,
      startDay: this.firstDay,
      endDay: this.lastDay,
    };

    this.getDonhangs(obj);
    this.filterOrders();
  }
  filterOrders() {
    if (!this.donhangs) return;
    this.overviews = [];
    this.filterOrder = Array.from(this.donhangs as any).filter((x: any) => {
      return x.status != "Đã Hủy";
    });
    this.dataService.sendMessage({ filterOrder: this.filterOrder });
    const tongDon = Array.from(this.filterOrder).length;
    const tongDoanhThu = Array.from(this.filterOrder)
      .map((x: any) => parseInt(x["pay"])||0)
      .reduce((a: number, b: number) => a + b, 0);
    const tiencong = Array.from(this.filterOrder)
      .map((x: any) => parseInt(x["wage"])||0)
      .reduce((a: number, b: number) => a + b, 0);
    const tongChietKhau = Array.from(this.filterOrder)
      .map((x: any) => (x["discount"] ? parseInt(x["discount"]) : 0))
      .reduce((a: number, b: number) => a + b, 0);
    this.overviews.push({ title: "Đơn Hàng", sum: tongDon });
    this.overviews.push({ title: "Doanh Thu", sum: tongDoanhThu });
    this.overviews.push({ title: "Chiết Khấu", sum: tongChietKhau });
    this.chitiets = this.filterOrder.map((x: any) => x["details"]).flat();
    this.filterChiTiets = Array.from(this.chitiets);
    //console.log(this.filterOrder.map((x:any)=>x.createdAt))

    this.dataService.sendMessage({
      donut: this.filterChiTiets,
      title: this.title,
      donhangs: this.filterOrder,
      chitiets: this.chitiets,
    });
    const ttChiTiet = Array.from(this.filterChiTiets)
      .map((x: any) => parseInt(x.quantity||0) * parseInt(x.importPrice||0))
      .reduce((a: number, b: number) => a + b, 0);
    this.overviews.push({
      title: "Lợi Nhuận",
      sum: tongDoanhThu - tongChietKhau - ttChiTiet + tiencong,
    });
  
  }
  onRangeDate(start: any, event: any) {
    if (start == "start") {
      this.firstDay = new Date(event.target.value);
    }
    if (start != "start") {
      this.lastDay = new Date(event.target.value);
    }
    this.title = `Từ ${this.firstDay.toLocaleDateString(
      "vi"
    )} Đến ${this.lastDay.toLocaleDateString("vi")}`;
    const obj = {
      pageSize: 10000,
      page: 0,
      startDay: this.firstDay,
      endDay: this.lastDay,
    };

    this.getDonhangs(obj);
    this.filterOrders();
  }
}
