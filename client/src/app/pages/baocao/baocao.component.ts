import { Component } from "@angular/core";
import { BaseApiUrl } from "src/app/general";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-baocao",
  templateUrl: "./baocao.component.html",
  styleUrls: ["./baocao.component.scss"],
})
export class BaocaoComponent {
  constructor(private service: ApiService) {}
  async ngOnInit() {
    this.getAll();
  }
  getAll() {
    console.log('getAll')
    this.service.get(BaseApiUrl.All).then((data: any) => {
      console.log(data);
    });
  }
}
