import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ServiceApiService {
  constructor(private http: HttpClient) {}
  getAll(table: any) {
    const baseUrl = `http://localhost:3177/api/${table}`;
    return new Promise((res, rej) => {
      this.http.get(baseUrl).subscribe((e: any) => {
      
        res(e);
      });
    });
  }
}
