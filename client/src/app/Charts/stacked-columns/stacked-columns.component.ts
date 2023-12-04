import { Component, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
} from "ng-apexcharts";
import { DataService } from "src/app/services/data.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
@Component({
  selector: "app-stacked-columns",
  templateUrl: "./stacked-columns.component.html",
  styleUrls: ["./stacked-columns.component.scss"],
})
export class StackedColumnsComponent {
  @ViewChild("chart") chart: any;
  public chartOptions: any;
  data: any[] = [];
  constructor(private dataService: DataService) {
    this.onInitChart();
  }
  onInitChart() {
    this.chartOptions = {
      series: [
        {
          name: "PRODUCT A",
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: "PRODUCT B",
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: "PRODUCT C",
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: "PRODUCT D",
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      chart: {
        type: "bar",
        height: 250,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 250,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: "category",
        categories: [
          "01/2011",
          "02/2011",
          "03/2011",
          "04/2011",
          "05/2011",
          "06/2011",
        ],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    };
  }
  ngOnInit() {
    this.onInitChart();
    this.dataService.currentMessage.subscribe((data: any) => {
      if (data.filterOrder) {
      }
    });
  }
  ngAfterViewInit() {
    //  console.log(this.chartOptions);
    this.dataService.currentMessage.subscribe((result: any) => {
      this.data = result.filterOrder;
      console.log(this.data);
    });
  }
}
