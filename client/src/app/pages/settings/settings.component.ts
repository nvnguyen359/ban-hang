import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { PrinterModel } from "src/app/Models/printer";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  printers!: any;
  pageSizes: string[] = ["A4", "A5", "A6", "A7"];
  selectedPrinter: any;
  formPrinter = this.fb.group({
    namePrinter: ["", Validators.required],
    pageSize: ["", Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private readonly apiService: ApiService,
    private http: HttpClient
  ) {
    this.apiService.get('nhaphang').then((data)=>console.log(data))
    this.apiService.get("printers").then((data) => {
      this.printers = data as PrinterModel[];
      this.selectedPrinter = this.printers.find(
        (x: PrinterModel) => x.default == true
      ).deviceId;
      const getDataPrinter = JSON.parse(`${localStorage.getItem("printer")}`);

      this.formPrinter = this.fb.group({
        namePrinter: [
          !getDataPrinter ? this.selectedPrinter : getDataPrinter.namePrinter,
          Validators.required,
        ],
        pageSize: [
          !getDataPrinter ? "A7" : getDataPrinter.pageSize,
          Validators.required,
        ],
      });
    });
  }

  formBank = this.fb.group({
    namebank: ["", Validators.required],
    numberbank: ["", Validators.required],
    name: [""],
  });
  formStore = this.fb.group({
    namestore: ["", Validators.required],
    address: ["", Validators.required],
    contact: ["", Validators.required],
    content: ["", Validators.required],
  });
  onSubmit() {
    const form = this.formPrinter.value;
    localStorage.setItem("printer", JSON.stringify(form));
  }
 async onExportPdf() {
    const form = this.formPrinter.value;
    const data ={
      "html":"<h1>ha ha </h1> <img src='https://img.vietqr.io/image/vietinbank-113366668888-compact.jpg'/>",
      "idDonHang":"0002",
      "pageSize":form.pageSize,
      "pathForder":"D:/public"
    }
    const pathUrl = `${this.baseServer}/export`;
    this.http.put(pathUrl,data).subscribe({next:data=> console.log(data),error:error=>{console.log(error.message)}})
   
  }
 baseServer = "http://localhost:3176";
  onPrintPdf(){
    const form = this.formPrinter.value;
    const data ={
      "html":"<h1>ha ha </h1> <img src='https://img.vietqr.io/image/vietinbank-113366668888-compact.jpg'/>",
      "idDonHang":"0002",
      "pageSize":form.pageSize,
      "pathForder":"D:/public",
      'printerName':form.namePrinter
    }
     const pathUrl = `${this.baseServer}/printpdf`;
    this.http.put(pathUrl,data).subscribe({next:data=> console.log(data),error:error=>{console.log(error.message)}})
  }
  onPrintFile(){
    const form = this.formPrinter.value;
    const name =`${form.namePrinter}`
    const url=`print-order`
    const pathUrl = `${this.baseServer}/${url}`;
    this.http.put(pathUrl,{printerName:name}).subscribe({next:data=> console.log(data),error:error=>{console.log(error.message)}})
  
  }
}
