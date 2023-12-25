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
  constructor() {}

  set IdElementHtml(id: any) {
    this._idElement = id;
  }
  set Data(data: any) {
    this._data = data;
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
      labels: !this._0Xs
        ? ["Red", "Orange", "Yellow", "Green", "Blue"]
        : this._0Xs,
      datasets: [
        {
          // label: "Dataset 1",
          data: !this._0Ys ? dd : this._0Ys,
          // backgroundColor: Object.values(Utils.CHART_COLORS),
        },
      ],
    };
    if (!this._type) this._type = "doughnut";
    if (!this._data) this._data = data;
    const type = this._type;
    const chartjs = new Chart(this._idElement, {
      type: this._type,
      data: this._data,
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            // color: "white",
            formatter: function (value: any, context: any) {
              if (type == typeChart.Doughnut) {
                const sum = Array.from(data.datasets[0].data).reduce((a:any,b:any)=>a+b,0) as any;
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
