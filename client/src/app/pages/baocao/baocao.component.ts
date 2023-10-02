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
    this.getAll();
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
      const mount = firstlastMonth(y, m);
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
      this.firstDay = new Date(y,0,1);
      this.lastDay = new Date(y,11,31,23,59,59,999);
    }
    console.log(this.firstDay, this.lastDay);
    let range=this.range.value;
    console.log(range)
  }
  onRangeDate(start:any,event:any){
    let range=this.range.value;
    console.log(event)
  }
}
