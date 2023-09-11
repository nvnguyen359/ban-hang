import { ElementRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class IsLoadingServiceX {
  element: any;
  isLoad =true;
  constructor() {
    this.element = document.getElementById("spin-1");
    console.log('isloading')
  }
  add() {
    console.log('add')
    document.getElementById("spin-1")?.classList.remove("hide");
  }
  remove() {
    document.getElementById("spin-1")?.classList.add("hide");
  }
   
}
