import { Component } from "@angular/core";
import { BaseApiUrl, links } from "src/app/general";

@Component({
  selector: "app-menu-left",
  templateUrl: "./menu-left.component.html",
  styleUrls: ["./menu-left.component.scss"],
})
export class MenuLeftComponent {
  ver: string = JSON.stringify(localStorage.getItem("ver"));
  links = links();
  constructor() {}
}
