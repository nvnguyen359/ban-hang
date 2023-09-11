import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  httpOptions = {
    //
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      responseType: "blob",
    }),
  };

  baseServer = "http://localhost:3176";
  constructor(private http: HttpClient) {}
  async get(url: string, name = "") {
    // const params = new HttpParams({fromString: name});
    const n = name ? name : "";
    this.httpOptions.headers.set("printerName", n);
    const pathUrl = `${this.baseServer}/${url}`;
    return new Promise((res, rej) => {
      this.http.get(pathUrl, this.httpOptions).subscribe((data) => {
        return res(data);
      });
    });
  }
  async getId(url: string, id = "") {
    const pathUrl = `${this.baseServer}/${url}/${id}`;
    console.log(pathUrl)
    return new Promise((res, rej) => {
      this.http.get(pathUrl, this.httpOptions).subscribe((data) => {
        return res(data);
      });
    });
  }
  async put(url: string, data: any) {
    const pathUrl = `${this.baseServer}/${url}`;
    console.log(data);
    console.log(pathUrl);
    return new Promise((res, rej) => {
      this.http.put(pathUrl, data, this.httpOptions).subscribe((data) => {
        return res(data);
      });
    });
  }

  async post(url: string, data: any) {
    let req = !Array.isArray(data) ? [data] : data;

    req = Array.from(data).map((x: any) => {
      x["Id"] = "";
      return x;
    });
    console.log("data", data);
    const pathUrl = `${this.baseServer}/${url}`;
    console.log(pathUrl);
    return new Promise((res, rej) => {
      this.http.post(pathUrl, data, this.httpOptions).subscribe((e) => {
        res(e);
      });
    });
  }
  async destroy(url: string, id: any) {
    const pathUrl = `${this.baseServer}/${url}/${id}`;
    console.log(pathUrl);
    return new Promise((res, rej) => {
      this.http.delete(pathUrl, this.httpOptions).subscribe((e) => {
        res(e);
      });
    });
  }

  dowloadfileTemplate() {
    const url = `${this.baseServer}/download`;
    window.location.href = url;
    this.http
      .get(url, { responseType: "blob", reportProgress: true })
      .subscribe((e) => {
        console.log(e);
        // window.location.href = url
      });
  }
}
