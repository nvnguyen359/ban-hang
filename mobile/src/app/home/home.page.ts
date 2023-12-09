import { Component } from "@angular/core";
import { ServiceApiService } from "../service-api.service";
import { HttpClient, HttpHeaders, JsonpInterceptor } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  data: any;
  count = 0;
   baseUrl = `http://localhost:3177/api/customer`;
   urlQrviet='https://api.vietqr.io/v2/banks'; 
   httpOptions = {
    //
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      responseType: "blob",
    }),
  };
  constructor(private service: ServiceApiService,private http:HttpClient) {
  
    http.get(this.baseUrl,this.httpOptions).subscribe(e=>{
      this.data = JSON.stringify(e)
      //this.count = e.count;
    },error => {
      this.data=JSON.stringify(error)
    })
   
  }


}
