import { Component } from "@angular/core";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-nhaphang",
  templateUrl: "./nhaphang.component.html",
  styleUrls: ["./nhaphang.component.scss"],
})
export class NhaphangComponent {
  constructor(private apiService: ApiService) {
    this.getAll("nhaphang");
  }
  getAll(nameSheet: string, item?: any) {
    this.apiService.get(nameSheet).then((e) => {
      console.log(e);
    });
  }
}
