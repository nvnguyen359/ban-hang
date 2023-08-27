import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  httpOptions = {//'responseType':'blob'
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      
    })
  };

  baseServer = "http://localhost:3176";
  constructor(private http: HttpClient) {}
  async get(url: string) {
 
    const pathUrl = `${this.baseServer}/${url}`;
    return new Promise((res, rej) => {
      this.http.get(pathUrl,this.httpOptions).subscribe((data) => {
       return res(data);
      });
    });
  }


  async put(url:string, data:any,option:any){
    const pathUrl = `${this.baseServer}/${url}`;

    return  this.http.put(pathUrl,data,this.httpOptions)
    
  }

  async post(url:string, data:any){
    const pathUrl = `${this.baseServer}/${url}`;
    console.log(pathUrl)
    return new Promise((res, rej) => {
      this.http.post(pathUrl,data,this.httpOptions).subscribe((e) => {
        res(e);
      });
    });
  }
  async destroy(url:string, id:any){
    const pathUrl = `${this.baseServer}/${url}/${id}`;
    console.log(pathUrl)
    return new Promise((res, rej) => {
      this.http.delete(pathUrl,this.httpOptions).subscribe((e) => {
        res(e);
      });
    });
  }


  dowloadfileTemplate() {
    const url = `${this.baseServer}/download`;
   window.location.href = url
    this.http.get(url, { responseType: 'blob',reportProgress:true }).subscribe((e)=>{
      console.log(e)
     // window.location.href = url
    });
  }

}
