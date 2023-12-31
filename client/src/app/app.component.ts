import { Component, Inject } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import "./lib.extensions";
import { NavigationStart, Router, RouterEvent } from "@angular/router";
import { BaseApiUrl, Status, links } from "./general";
import { filter } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DataService } from "./services/data.service";
import { ApiService } from "./services/api.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "client";
  showFiller = false;
  pageName?: string = "Trang Chủ";
  url = "/";
  search = "";
  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private service: ApiService
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        const url = event.url;
        this.url = url;
        this.pageName = links().find((x: any) => x.link == url)?.text;
      }
    });
  }
  ngOnInit(): void {
    this.http
      .get("http://localhost:3177/api/database")
      .subscribe((data: any) => console.log(data));
    this.vi();
    setTimeout(() => {
      if (location.pathname == "/")
        this.router.navigate([`/${BaseApiUrl.BaoCaos}`]);
    }, 1000);
  }
  vi() {
    this._locale = "vi";
    this._adapter.setLocale(this._locale);
  }
  onRefesh() {
    // Refresh the page
    location.reload();
  }
  onSearch() {
    if (this.search != "") {
      const item = document.getElementById("id-input-search");
      if (item) {
        item.style.width = "100%";
        item.style.opacity = "1";
        item.focus();
      }
    }
    this.dataService.sendMessage({ value: this.search, status: Status.Search });
  }
  onShowSearch() {
    return this.search != "" ? "show" : "";
  }
  onClose() {
    this.search = "";
    this.dataService.sendMessage({ value: '', status: Status.Search });
  }
}
