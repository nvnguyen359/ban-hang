import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { BaseApiUrl, firstLastDate, firstlastMonth } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { getStarEndDateInQuarter, getQuarter,getStartEndMonthInQuarter } from "../../general";
import { DonHang } from "src/app/Models/donHang";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from "ng-apexcharts";
import { DataService } from "src/app/services/data.service";
import { ChiTietDonHang } from "src/app/Models/chiTietDonHang";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
@Component({
  selector: "app-baocao",
  templateUrl: "./baocao.component.html",
  styleUrls: ["./baocao.component.scss"],
})
export class BaocaoComponent {
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

  title = `Ngày ${new Date().toLocaleDateString()}`;
  constructor(private service: ApiService, private dataService: DataService) {
    // console.log(new Date().firstLastYear());
    const date = firstLastDate();
    this.firstDay = date.firstDate;
    this.lastDay = date.lastDate;
    this.title = `Ngày ${new Date().toLocaleDateString()}`;
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
  getAll() {
    this.service.get(BaseApiUrl.All).then((data: any) => {
      console.log(data);
      if (!data) return;
      if (data["donhangs"]) {
        this.donhangs = (data["donhangs"] as any[]).map((x: any) => {
          x["Ngày Bán"] = `${x["Ngày Bán"]}`.DateVNToISO();
          x["chitiets"] = Array.from(x["chitiets"] as ChiTietDonHang[]).map(
            (a: ChiTietDonHang) => {
              a["Ngày"] = `${a["Ngày"]}`.DateVNToISO();
              return a;
            }
          );
          return x;
        });
        this.chitiets = (data["chitiets"] as any[]).map((x: any) => {
          x["Ngày"] = `${x["Ngày"]}`.DateVNToISO();
          return x;
        });

        this.filterOrders();
      }
    });
  }
  getDonhangs() {
    this.service.get(BaseApiUrl.Orders).then((e: any) => {
      this.donhangs = e as DonHang[];
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
      this.title = `Ngày ${this.firstDay.toLocaleDateString('vi')}`;
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
      const mount = firstlastMonth(y, m );
      this.firstDay = mount.firstDay;
      this.lastDay = mount.lastDay;
      this.title = `Tháng ${
        this.firstDay.getMonth() + 1
      }/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes("quinay")) {
      const m = getQuarter(new Date());
      const quarter = getStartEndMonthInQuarter();
      console.log(quarter)
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
    this.filterOrders();
  }
  filterOrders() {
    if (!this.donhangs) return;
    this.overviews = [];
    this.filterOrder = Array.from(this.donhangs)
      .filter((x: any) => {
        const date = new Date(x["Ngày Bán"]);
        return (
          date >= this.firstDay &&
          date <= this.lastDay &&
          x["Trạng Thái"] != "Đã Hủy"
        );
      })
      .map((x: any) => {
        x["Chiết Khấu"] = parseInt(x["Chiết Khấu"]);
        x["Số Lượng"] = parseInt(x["Số Lượng"]);
        x["Thanh Toán"] = parseInt(x["Thanh Toán"]);
        x["Thành Tiền"] = parseInt(x["Thành Tiền"]);
        const chitiets = (x["chitiets"] as ChiTietDonHang[]).map((x: any) => {
          x["Ngày"] = new Date(x["Ngày"]);
          x["Đơn giá"] = parseInt(x["Đơn giá"]);
          x["Giá Nhập"] = parseInt(x["Giá Nhập"]);
          x["Số Lượng"] = parseInt(x["Số Lượng"]);
          return x;
        });
        x["chitiets"] = chitiets;
        return x;
      });

    const tongDon = Array.from(this.filterOrder).length;
    const tongDoanhThu = Array.from(this.filterOrder)
      .map((x: any) => parseInt(x["Thanh Toán"]))
      .reduce((a: number, b: number) => a + b, 0);
    const tongChietKhau = Array.from(this.filterOrder)
      .map((x: any) => parseInt(x["Chiết Khấu"]))
      .reduce((a: number, b: number) => a + b, 0);
    this.overviews.push({ title: "Đơn Hàng", sum: tongDon });
    this.overviews.push({ title: "Doanh Thu", sum: tongDoanhThu });
    this.overviews.push({ title: "Chiết Khấu", sum: tongChietKhau });
    this.chitiets = this.filterOrder.map((x: any) => x["chitiets"]).flat();
    this.filterChiTiets = Array.from(this.chitiets).filter((x: any) => {
      const date = false ? `${x["Ngày"]}`.DateVNToISO() : x["Ngày"];
      return date >= this.firstDay && date <= this.lastDay;
    });
    this.dataService.sendMessage({
      donhangs: this.filterOrder,
      title: this.title,
      chitiets: this.chitiets,
    });
    this.dataService.sendMessage({
      donut: this.filterChiTiets,
      title: this.title,
    });
    const ttChiTiet = Array.from(this.filterChiTiets)
      .map((x: any) => parseInt(x["Số Lượng"]) * parseInt(x["Giá Nhập"]))
      .reduce((a: number, b: number) => a + b, 0);
    console.log(ttChiTiet);
    this.overviews.push({
      title: "Lợi Nhuận",
      sum: tongDoanhThu - tongChietKhau - ttChiTiet,
    });
  }
  onRangeDate(start: any, event: any) {
    if (start == "start") {
      this.firstDay = event.target.value;
    }
    if (start != "start") {
      this.lastDay = event.target.value;
    }
    this.title = `Từ ${this.firstDay.toLocaleDateString(
      
    )} Đến ${this.lastDay.toLocaleDateString()}`;
    this.filterOrders();
  }
}
