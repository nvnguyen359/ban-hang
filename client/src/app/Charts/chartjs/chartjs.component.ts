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
import Chart, { ChartItem, elements, registerables } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Options } from "src/app/Models/chartjs";
import { delay, typeChart } from "src/app/general";
import { DataService } from "src/app/services/data.service";
import { CreateChart, DatasetChartjs, TYPEJS } from "./createChart";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

Chart.register(...registerables);
@Component({
  selector: "app-chartjs",
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: "./chartjs.component.html",
  styleUrl: "./chartjs.component.scss",
})
export class ChartjsComponent {
  @Input() options!: Options;
  currentValue: any;
  chartJs!: Chart;
  valueType = "line";
  id = Math.floor(Math.random() * 10000 + 1) + "-chart";
  public Axes: string[] = [];
  labels: any;
  datasets: any;
  typeArray: any[] = [];
  constructor(
    private dataService: DataService,
    private createChart: CreateChart
  ) {}

  async ngOnInit() {
    await delay(100);
    this.createChart.IdElement = this.id;
    this.createChart.mixChart();
    this.typeArray = Object.values(TYPEJS);
  }
  ngOnChanges(changes: SimpleChanges) {
   const repone=changes['options']['currentValue'];
   console.log(repone)
   this.createChart.Type = repone.type;
   this.valueType = repone.type;
  // console.log(repone["data"]);
   const data = repone["data"];
   if (data?.length < 1) return;
   if (data&&data[0]?.x) {
     this.datasets = [
       {
         type: this.valueType,
         label: "Bar Dataset",
         axesX: "x",
         axesY: "y",
         data: data.map((a: any) => a.y),
       },
     ];
     this.labels = data.map((a: any) => a.x);
     this.createChart.drawChart(this.labels, this.datasets);
   } else {
     this.Axes = Object.keys(data[0]);
     console.log(this.Axes);
   }
  }
  async onChangeType(event: any) {
    const val = event.target.value;
    try {
      this.createChart.IdElement = this.id;
      this.createChart.Type = val;
      this.valueType = val;
      this.datasets = Array.from(this.datasets).map((x: any) => {
        x.type = val;
        return x;
      });
      this.createChart.drawChart(this.labels, this.datasets, val);
    } catch (error) {
      // this.createChart._idElement = "chart"+this.id;
      console.log(error);
    }
  }
}
