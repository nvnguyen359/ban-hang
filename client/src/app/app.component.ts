import { Component, Inject } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import "./lib.extensions";
import { NavigationStart, Router, RouterEvent } from "@angular/router";
import { BaseApiUrl, links } from "./general";
import { filter } from "rxjs";
import { HttpClient } from "@angular/common/http";
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
  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private router: Router,
    private http: HttpClient
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
    location.replace(location.href);
  }
}
