import { Component } from "@angular/core";
import { LoaderService } from "src/app/services/loader.service";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"],
})
export class SpinnerComponent {
  constructor(public loader: LoaderService) {
   
  }
  // ngOnInit(){
  //   this.loader.isLoading = false;
  // }
  // ngAfterViewInit(){
  //   this.loader.isLoading = true;
  // }
  // ngOnChanges(){
  //   this.loader.isLoading = true;
  // }
}
