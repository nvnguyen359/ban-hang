import { Component, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexMarkers,
  ApexXAxis,
  ApexPlotOptions,
} from "ng-apexcharts";
import { ChiTietDonHang } from "src/app/Models/chiTietDonHang";
import { DonHang } from "src/app/Models/donHang";
import { DataService } from "src/app/services/data.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  labels: string[];
  stroke: any;
  markers: ApexMarkers;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  tooltip: any;
};
@Component({
  selector: "app-chart-order",
  templateUrl: "./chart-order.component.html",
  styleUrls: ["./chart-order.component.scss"],
})
export class ChartOrderComponent {
  labels: any[] = [];
  series: any[] = [];
  title: string = "";
  columnsOrders: any[] = [];
  columnsDoanhThu: any[] = [];
  columnsLoiNhuan: any[] = [];
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;
  ininitData: any[] = [
    {
      name: "Đơn Hàng",
      type: "column",
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
    },
    // {
    //   name: "Doanh Thu",
    //   type: "line",
    //   data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
    // },
    // {
    //   name: "Lợi Nhuận",
    //   type: "line",
    //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
    // },
  ];
  initStroke: any = {
    width: [0, 2, 1],
    curve: "smooth",
  };
  constructor(private dataService: DataService) {
    const widthScreen = window.outerWidth-50;
    this.chartOptions = {
      series: this.ininitData,
      chart: {
        height: 200,
        type: "line",
        width: '100%',
        stacked: false,
      },
      stroke: this.initStroke,
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },

      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        "01/01/2003",
        "02/01/2003",
        "03/01/2003",
        "04/01/2003",
        "05/01/2003",
        "06/01/2003",
        "07/01/2003",
        "08/01/2003",
        "09/01/2003",
        "10/01/2003",
        "11/01/2003",
      ],
      markers: {
        size: 0,
      },

      yaxis: {
        // title: {
        //   text: "Points",
        // },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;
          },
        },
      },
    };
  }

  ngOnInit() {
    this.dataService.currentMessage.subscribe((result: any) => {
      if (result.donhangs) {
        this.columnsDoanhThu = [];
        this.columnsOrders = [];
        this.columnsLoiNhuan = [];
        const donhangs = Array.from(result.donhangs).map((x: any) => {
          //console.log( x["Ngày Bán"],new Date( x["Ngày Bán"]).toLocaleDateString())
        x["Ngày Bán"] = new Date( x["Ngày Bán"]).toLocaleDateString();
          return x;
        });
    
        if (donhangs.length < 1) {
          this.chartOptions.labels = [];
         this.ininitData[0].data = [];
        };
        const dates = [...new Set(donhangs.map((x: any) => x["Ngày Bán"]))];
        dates.forEach((date: any) => {
          const dhs = donhangs.filter(
            (x: any) => x["Ngày Bán"] == date
          ) as DonHang[];
          this.columnsOrders.push(dhs.length);
          const dts = dhs
            .map((x: DonHang) => x["Thanh Toán"])
            .reduce((a: number, b: number) => a + b, 0);
          this.columnsDoanhThu.push(dts);
          let sum = 0;
          const chitiets = dhs.map((x: DonHang) => x["chitiets"]);
          chitiets.forEach((chitiet: any) => {
            const sumChitiet = chitiet
              .map(
                (x: any) => parseInt(x["Số Lượng"]) * parseInt(x["Giá Nhập"])
              )
              .reduce((a: number, b: number) => a + b, 0);
            sum += sumChitiet;
          });

          this.columnsLoiNhuan.push(sum);
        });
        this.labels = [...new Set(dates)].map((x:any)=>x.replace(`/${new Date().getFullYear()}`,''));
        this.chartOptions.labels = this.labels;
         this.ininitData[0].data = this.columnsOrders;
      //  this.ininitData[0].data = this.columnsDoanhThu;
        // this.ininitData[2].data = this.columnsLoiNhuan;
        this.chartOptions.series = this.ininitData;
      }
    });
  }
  public generateData(count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  }
}
