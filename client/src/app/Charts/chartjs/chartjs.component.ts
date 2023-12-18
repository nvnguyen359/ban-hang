import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import Chart, { ChartItem, elements } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Options } from "src/app/Models/chartjs";
import { delay, typeChart } from "src/app/general";
import { DataService } from "src/app/services/data.service";
Chart.register(ChartDataLabels);
@Component({
  selector: "app-chartjs",
  standalone: true,
  imports: [],
  templateUrl: "./chartjs.component.html",
  styleUrl: "./chartjs.component.scss",
})
export class ChartjsComponent {
  @Input() options!: Options;
  currentValue: any;
  chartJs!: Chart;
  id = Math.floor(Math.random() * 10000 + 1) + "-chart";
  constructor(private dataService: DataService) {}
  async createChart(obj: any = null, datax: any[] = []) {
    if (this.chartJs) {
      this.chartJs.destroy();
    }
    let datas =
      datax.length > 0
        ? datax
        : [
            { x: 2010, y: 10 },
            { x: 2011, y: 20 },
            { x: 2012, y: 15 },
            { x: 2013, y: 25 },
            { x: 2014, y: 22 },
            { x: 2015, y: 30 },
            { x: 2016, y: 28 },
          ];
    await delay(100);
    const chart = document.getElementById(this.id) as any;
    if (chart) {
      //  chart.options.plugins.legend.position = 'right';
    
      const labels = datas.map((a: any) => `${a.x}`);
      let data = {
        labels: labels,
        datasets: [
          {
            label: this.options.label,
            data: datas.map((a: any) => a.y),
            fill: true,
            backgroundColor: [
              "rgba(255, 99, 132, 0.95)",
              "rgba(255, 159, 64, 0.95)",
              "rgba(255, 205, 86, 0.95)",
              "rgba(75, 192, 192, 0.95)",
              "rgba(54, 162, 235, 0.95)",
              "rgba(153, 102, 255, 0.95)",
              "rgba(201, 203, 207, 0.95)",
            ],
            tension: 0.1,
          },
        ],
      };

      await delay(100);
      const config: any = {
        type: this.options.type,
        data: data,
        options: {
          plugins: {
            datalabels: {
              // color: "white",
              
              formatter: function (value: any, context: any) {

                if (obj?.type==typeChart.Doughnut) {
                  return (
                    Math.round(
                      (value * 100) /
                        datas
                          .map((a: any) => a.y)
                          .reduce((a: any, b: any) => a + b, 0)
                    ) + "%"
                  );
                } else {
                  return Math.round(value);
                }
              },
              font: {
                weight: "700",
                size: 20,
              },
            },
            legend: {
              display: false,
              position: "right",
              usePointStyle: true,
              onHover: (evt: any, item: any, legend: any) => {
                const chart = legend.chart;
                const tooltip = chart.tooltip;
                const chartArea = chart.chartArea;
                tooltip.setActiveElements(
                  [
                    {
                      datasetIndex: 0,
                      index: item.index,
                    },
                  ],
                  {
                    x: (chartArea.left + chartArea.right) / 2,
                    y: (chartArea.top + chartArea.bottom) / 2,
                  }
                );
                chart.update();
              },
            },
          },
        },
      };
      if (this.chartJs) this.chartJs.destroy();
      this.chartJs = new Chart(chart.getContext("2d"), config);
     // this.chartJs.update();
    }
  }
  componentWillUnmount() {
    // this.chartJs.destroy()
  }
  async ngOnInit() {
    await this.createChart(this.options);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.dataService.currentMessage.subscribe(async (e: any) => {
      if (e["chart"]) {
        console.log(e["chart"]);
        await this.createChart(this.options, e["chart"].data);
      }
    });
  }
}
