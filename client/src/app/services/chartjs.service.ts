import { Injectable } from "@angular/core";
import { Chart, registerables } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { typeChart } from "../general";
Chart.register(...registerables);
Chart.register(ChartDataLabels);
@Injectable({
  providedIn: "root",
})
export class ChartjsService {
  private _type: any | undefined;
  private _data: any;
  private _options: any;
  private _0Xs: any;
  private _0Ys: any;
  private _idElement: any;
  chartjs!: Chart;
  constructor() {}

  set IdElementHtml(id: any) {
    this._idElement = id;
  }
  set Data(data: any) {
    this._data = data;
  }
  set Oxs(oxs: any) {
    this._0Xs = oxs;
  }
  get Oxs(){
    return this._0Xs;
  }
  set Oys(oxs: any) {
    this._0Ys = oxs;
  }
  get Oys(){
    return this._0Ys;
  }
  set Options(options: any) {
    this._idElement = options;
  }
  drawChart() {
    let dd = [];
    const r = Math.floor(Math.random() * 10) + 5;
    for (let index = 0; index < 5; index++) {
      const element = Math.floor(Math.random() * 101);
      dd.push(element);
    }
    const data = {
      labels: !this.Oxs
        ? ["Red", "Orange", "Yellow", "Green", "Blue"]
        : this.Oxs,
      datasets: [
        {
          // label: "Dataset 1",
          data: !this.Oys ? dd : this.Oys,
          // backgroundColor: Object.values(Utils.CHART_COLORS),
        },
      ],
    };
    console.log(this.Oxs)
    console.log(this.Oys)
    if (!this._type) this._type = "doughnut";
    if (!this._data) this._data = data;
    const type = this._type;
    const _0ys= !this.Oys ? dd : this.Oys;
    const sum = Array.from(_0ys).reduce(
      (a: any, b: any) => a + b,
      0
    )
    // console.log(_0ys,sum)
    if (this.chartjs) this.chartjs.destroy();
    this.chartjs = new Chart(this._idElement, {
      type: this._type,
      data: this._data,
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            // color: "white",
            anchor: "center",
            formatter: function (value: any, context: any) {
              if (type == typeChart.Doughnut) {
                const sum = Array.from(_0ys).reduce(
                  (a: any, b: any) => a + b,
                  0
                ) as any;
                console.log(value,sum)
                return Math.round((value * 100) / sum) + "%";
              } else {
                return Math.round(value);
              }
            },
            font: {
              weight: "100",
              size: 14,
            },
          },
          legend: {
            position: "top",
            display: false,
          },
          title: {
            display: false,
            text: "Chart.js Doughnut Chart",
          },
        },
      },
    });
  }
}
