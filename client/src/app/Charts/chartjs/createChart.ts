import { Injectable } from "@angular/core";
import { Chart } from "chart.js";

import { Options } from "src/app/Models/chartjs";

@Injectable({
  providedIn: "root",
})
export class createChart {
  _options!: Options;
  _idElement:any;
  chartJs!: Chart;
  constructor() {}
  set Options(op: any) {
    this._options = op;
  }
  set idElement(op: any) {
    this._idElement = op;
  }
  get Options() {
    return this._options;
  }
  initData(){
    
  }
}
