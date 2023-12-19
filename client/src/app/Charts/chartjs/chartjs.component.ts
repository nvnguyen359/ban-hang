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
import { CreateChart, TYPEJS } from "./createChart";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
Chart.register(ChartDataLabels);
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
  id = Math.floor(Math.random() * 10000 + 1) + "-chart";
  typeArray: any[] = [];
  constructor(
    private dataService: DataService,
    private _createChart: CreateChart
  ) {}

  async ngOnInit() {
    await delay(100);
    this._createChart._idElement =  this.id;
    this._createChart.mixChart();
    this.typeArray = Object.values(TYPEJS);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.dataService.currentMessage.subscribe(async (e: any) => {
      if (e["chart"]) {
        console.log(e["chart"]);
      }
    });
  }
  async onChangeType(event: any) {
    const val = event.target.value;
    console.log(val);
    try {
      this._createChart._idElement = /* In the given code, `this` refers to the current instance of the
      `ChartjsComponent` class. It is used to access properties and
      methods of the class within its own scope. */
      /* In the given code, `this` refers to the current instance of the
      `ChartjsComponent` class. It is used to access properties and
      methods of the class within its own scope. */
      this.id;
      this._createChart.Type = val;
      this._createChart.mixChart();
    } catch (error) {
      // this._createChart._idElement = "chart"+this.id;
      console.log(error);
    }
  }
}
