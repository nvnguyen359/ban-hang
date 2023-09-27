import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { KhachHang } from "src/app/Models/khachHangs";
import { BaseApiUrl } from "src/app/general";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-dialog-customer",
  templateUrl: "./dialog-customer.component.html",
  styleUrls: ["./dialog-customer.component.scss"],
})
export class DialogCustomerComponent {
  khachhang?: KhachHang ;
  constructor(
    public dialogRef: MatDialogRef<DialogCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KhachHang,
    private fb: FormBuilder,
    private api:ApiService
  ) {
    this.khachhang = data;
  }
  private _formKhachHang = this.fb.group({
    "Tên Khách Hàng": ["", Validators.required],
    'Phone': ["", Validators.required],
    "Địa Chỉ": [""],
    "Email": [""],
    'Id':['']
  });
  public reultCode?:any;
  public get formKhachHang() {
    return this._formKhachHang;
  }
  public set formKhachHang(value) {
    this._formKhachHang = value;
  }
  ngOnInit() {
    console.log(this.khachhang)
    if (this.khachhang) {
      this._formKhachHang.controls["Tên Khách Hàng"].setValue(this.khachhang["Tên Khách Hàng"]);
      this._formKhachHang.controls.Phone.setValue(this.khachhang["Phone"]);
      this._formKhachHang.controls["Địa Chỉ"].setValue(this.khachhang["Địa Chỉ"]);
      this._formKhachHang.controls["Id"].setValue(this.khachhang["Id"]!);
    }
  }
  onSubmit(){
    let result = this._formKhachHang.value;
    const id = this._formKhachHang.value.Id;
    console.log('id',id,'result',result)
    const url ='khachhang'
    if(!id){
      
      this.api.post(BaseApiUrl.KhachHangs,result).then((e)=>{
        this.reultCode = e;
        console.log()
        this.dialogRef.close(e);
      })
    }else{
      this.api.put(BaseApiUrl.KhachHangs,result).then((e)=>{
        this.reultCode = e;
        this.dialogRef.close(e);
      })
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
