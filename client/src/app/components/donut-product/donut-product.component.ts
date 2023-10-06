import { Component, Input, ViewChild } from "@angular/core";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ChartComponent,
} from "ng-apexcharts";
import { ChiTietDonHang } from "src/app/Models/chiTietDonHang";
import { DataService } from "src/app/services/data.service";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: "app-donut-product",
  templateUrl: "./donut-product.component.html",
  styleUrls: ["./donut-product.component.scss"],
})
export class DonutProductComponent {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;
  labels: any[] = [];
  series: any[] = [];
  title: string = "";
  constructor(private dataService: DataService) {
    this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 500,
        type: "donut",
      },
      dataLabels: {
        enabled: true,
      },
      labels: [44, 55, 41, 17, 15],
      fill: {
        type: "gradient",
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
      },
      responsive: [
        {
          // breakpoint: 480,
          options: {
            chart: {
              // width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }
  ngOnInit() {
    this.dataService.currentMessage.subscribe((result: any) => {
      if (result.donut) {
        const array = Array.from(result.donut) as ChiTietDonHang[];
        if (array.length > 0) {
          this.chartOptions = {
            chart: {
              width: 650,
              type: "donut",
            },
          };
          this.title = `Sản phẩm bán chạy ` + result.title;
          this.labels = [...new Set(array.map((x: any) => x["Tên Sản Phẩm"]))];
          this.series = [];
          this.labels.forEach((x: any) => {
            const t = array
              .filter((f: ChiTietDonHang) => f["Tên Sản Phẩm"] == x)
              .map((x: ChiTietDonHang) => parseInt(x["Số Lượng"] + ""))
              .reduce((a: number, b: number) => a + b, 0);
            this.series.push(t);
          });

          this.chartOptions.labels = this.labels;
          this.chartOptions.series = this.series;
        } else {
          this.chartOptions.labels = [];
          this.chartOptions.series = [];
        }
      }
    });
  }
}
