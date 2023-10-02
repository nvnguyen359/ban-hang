import { Component } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { BaseApiUrl, firstlastMonth } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { getStarEndDateInQuarter, getQuarter } from "../../general";
import { DonHang } from "src/app/Models/donHang";
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
  overviews: any[] = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(private service: ApiService) {
    console.log(new Date().firstLastYear());
  }
  async ngOnInit() {
    this.getMonths();
    this.getQuanter();
    this.getYears();
    // this.getAll();
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
          return x;
        });
        console.log(this.donhangs);
      }
    });
  }
  getDonhangs() {
    this.service.get(BaseApiUrl.DonHangs).then((e: any) => {
      this.donhangs = e as DonHang[];
      console.log(this.donhangs);
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
    }
    if (`${event}`.includes("Tháng")) {
      const m = parseInt(`${event}`.replace("Tháng", "").trim());
      const mount = firstlastMonth(y, m - 1);
      this.firstDay = mount.firstDay;
      this.lastDay = mount.lastDay;
    }
    if (`${event}`.includes("Quí")) {
      const m = parseInt(`${event}`.replace("Quí", "").trim());
      const quarter = getStarEndDateInQuarter(m, y);
      this.firstDay = quarter.firstDate;
      this.lastDay = quarter.lastDate;
    }
    if (`${event}`.includes("năm")) {
      this.firstDay = new Date(y, 0, 1);
      this.lastDay = new Date(y, 11, 31, 23, 59, 59, 999);
    }
    console.log(this.firstDay, this.lastDay);
    this.filterOrders();
  }
  filterOrders() {
    this.overviews=[]
    this.filterOrder = Array.from(this.donhangs)
      .filter((x: any) => {
        const date = `${x["Ngày Bán"]}`.DateVNToISO();
        return date >= this.firstDay && date <= this.lastDay;
      })
      .map((x: any) => {
        // x["Giá Bán"] = parseInt(x["Giá Bán"]);
        x["Chiết Khấu"] = parseInt(x["Chiết Khấu"]);
        x["Số Lượng"] = parseInt(x["Số Lượng"]);
        x["Thanh Toán"] = parseInt(x["Thanh Toán"]);
        x["Thành Tiền"] = parseInt(x["Thành Tiền"]);
        return x;
      });
   const tongDon = Array.from(this.filterOrder).length;
   const tongDoanhThu =Array.from(this.filterOrder).map((x:any)=>x['Thanh Toán']).reduce((a:number,b:number)=>a+b,0);
   const tongChietKhau =Array.from(this.filterOrder).map((x:any)=>x['Chiết Khấu']).reduce((a:number,b:number)=>a+b,0);
    this.overviews.push({title:'Đơn Hàng',sum:tongDon });
    this.overviews.push({title:'Doanh Thu',sum:tongDoanhThu })
    this.overviews.push({title:'Chiết Khấu',sum:tongChietKhau })
    console.log(this.tongDon,this.tongDoanhThu)
  }
  onRangeDate(start: any, event: any) {
    if (start == "start") {
      this.firstDay = event.target.value;
    }
    if (start != "start") {
      this.lastDay = event.target.value;
    }
    console.log(this.firstDay, this.lastDay);
  }
}
