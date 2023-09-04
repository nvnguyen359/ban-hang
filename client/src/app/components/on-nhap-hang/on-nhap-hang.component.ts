import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import { FormArray, FormBuilder, FormGroup,FormControl } from "@angular/forms";
import { SanPham } from "src/app/Models/sanPham";
import { NhapHang } from "src/app/Models/nhapHang";

@Component({
  selector: "app-on-nhap-hang",
  templateUrl: "./on-nhap-hang.component.html",
  styleUrls: ["./on-nhap-hang.component.scss"],
})
export class OnNhapHangComponent {
  form: any ;
  sanphams?: SanPham[];
  nhaphangs: NhapHang[];
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    console.log(data)
    //if (!data) return;
    this.sanphams = data.sanPhams;
    this.nhaphangs = data.nhs;
    this.form = this.fb.group({
      published: true,
      nhs: this.fb.array( this.nhaphangs),
    });

  }

  addRow() {
    console.log(document.getElementById('test'))
    const creds = this.form.controls["nhs"] as FormArray;
    creds.push(
      this.fb.group({
        // Id: "",
        "Tên sản phẩm": "string",
        // "Sản Phẩm": "string",
        // "Số Lượng": "number",
        // "Đơn Vị Tính": "string",
        // "Giá Nhập": "number",
        // "Giá Bán": "number",
        // "Thành tiền": "number",
        // "Ghi chú": "number",
        // "Ngày Nhập": "Date",
        // index: "number",
      })
    );
  }
}
