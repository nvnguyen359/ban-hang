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
  formBank: any;
  optionsBanhks = {
    name: "name",
    showtext: "name",
    label: "Ngân Hàng",
    placeholder: "Danh Sách Ngân Hàng",
    banks: true,
  };
  binBank: any = "";
  initBank = {
    accountNumber: "0041000171668",
    shortName: "Vietcombank",
    accountName: "DO VAN HIEU",
    bin: "",
  };
  initStore = {
    name: "MÁY PIN HIỆU NGÂN",
    phone: "<b>0988.114.714</b> - <b>0842.399.889</b>",
    address: "TDP Hữu Lộc, P.Trúc Lâm, Nghi Sơn, Thanh Hóa",
    infoPlus: " Chuyên: máy pin - cung cấp linh kiện ngành pin",
  };
  qrViet = {
    Client_ID: "c3503c91-f295-4574-ab2a-206e7f58a334",
    API_Key: "10a474b4-fc88-45ae-9bcd-18316d1ffe23",
  };
  constructor(private service: ApiService, private fb: FormBuilder) {
    this.initFormBank();
  }
  async ngOnInit() {
    this.banks = ((await this.service.getBanks()) as any)?.data;
    this.initFormBank();
    console.log(this.formBank.controls["accountNumber"]);
    this.formBank.controls["banks"].patchValue(this.initBank.accountNumber);
    this.formBank.controls["banks"].patchValue({
      accountNumber: this.initBank.accountNumber,
    });
    const find = this.banks.find(
      (x: any) => x.shortName == this.initBank.shortName
    );
    this.initBank.bin = find.bin;
    this.formBank.controls["banks"].patchValue(this.initBank);
    this.formBank.controls["banks"].patchValue({
      accountName: this.initBank.accountName,
    });
    this.formBank.controls["banks"].patchValue({
      accountName: this.initBank.accountName,
    });
    this.formBank.controls["store"].patchValue(this.initStore);
    // this.formBank.controls["store"].patchValue({ phone: this.initStore.phone });
    // this.formBank.controls["store"].patchValue({ address: this.initStore.address });
    // this.formBank.controls["store"].patchValue({ name: this.initStore.name });
  }
  initFormBank(obj = null) {
    this.formBank = this.fb.group({
      id: "",
      banks: this.fb.group({
        bin: "",
        accountNumber: [
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(19),
          ],
        ],
        accountName: [""],
      }),
      ghn: this.fb.group({
        token: "",
        Client_id: "",
        ShopID: "",
      }),
      store: this.fb.group({
        name: "",
        phone: "",
        address: "",
        infoPlus: "",
      }),
    });
  }
  onSelectBank(event: any) {
    this.binBank = event.bin;
    this.formBank.controls["banks"].patchValue({
      bin: event.bin,
    });
  }
  async onSubmitBank(event: any = null) {
    const value = event.target.value;
    if (value.length >= 10 && value.length <= 19) {
      const formValue = this.formBank.value;
      console.log(formValue);
      const result = (await this.service.lookupBank(formValue.banks)) as any;
      console.log(result);
      if (result.code == "00") {
        this.formBank.controls["banks"].patchValue({
          accountName: result.data.accountName,
        });
      } else {
        this.formBank.controls["banks"].patchValue({
          accountName: this.initBank.accountName,
        });
      }
    }
  }
  onFocus() {
    const formValue = this.formBank.value;

    console.log(formValue);
  }
  onSubmit() {
    const formValue = this.formBank.value;
    const id = formValue.id;
    if (id == "") {
      delete formValue.id;
      const obj = {
        name: 'name',
        jsonData:JSON.stringify(formValue),
        id,
        createdAt:new Date(),
        updatedAt: new Date()
      };
      this.service.create("store", obj).then((e: any) => {
        console.log(e);
      });
    }
  }
}
