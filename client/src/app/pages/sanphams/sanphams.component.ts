import { Component } from "@angular/core";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-sanphams",
  templateUrl: "./sanphams.component.html",
  styleUrls: ["./sanphams.component.scss"],
})
export class SanphamsComponent {
  constructor(
    private service: ApiService,
  ) {}
  sanphams: any;
  async ngOnInit() {
    //await this.getSanphams();
  }
  async getSanphams() {
    this.sanphams = await this.service.get("sanpham");
    console.log(this.sanphams)
  }
}
