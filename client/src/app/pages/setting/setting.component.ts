import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, RequiredValidator, Validators } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent {
  banks: any[] = [];
  formBank?: any;
  optionsBanhks = {
    name: "name",
    showtext: "name",
    label: "Ngân Hàng",
    placeholder: "Danh Sách Ngân Hàng",
    banks: true,
  };
  binBank: any = "";
  constructor(private service: ApiService, private fb: FormBuilder) {
   this.initFormBank()
  }
  async ngOnInit() {
    this.banks = ((await this.service.getBanks()) as any)?.data;
    this.initFormBank()
  }
  initFormBank(){
    this.formBank = this.fb.control({
       bin: ["", Validators.required],
      accountNumber: ["", Validators.required,Validators.minLength(6),Validators.maxLength(19)],
      accountName: "",
    });
  }
  onSelectBank(event: any) {
    console.log(event);
    this.binBank = event.bin;
  }
  onSubmitBank(event:any=null){
    const value = event.target.value;
    if(value.length>=6 && value.length<=19){
      const formValue = this.formBank.value;
      console.log(formValue)
      //this.service.lookupBank({bin:})
    }
    console.log('ok',value)
  }
}
