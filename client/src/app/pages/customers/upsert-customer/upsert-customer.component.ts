import { Component, Inject } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-upsert-customer",
  templateUrl: "./upsert-customer.component.html",
  styleUrls: ["./upsert-customer.component.scss"],
})
export class UpsertCustomerComponent {
  form: any;
  infor ='Thêm Khách Hàng Mới';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    let formArray = this.fb.array([]) as FormArray;

    let array: any = [];
    if (this.data) {
      array = Array.isArray(this.data) ? Array.from(this.data) : [this.data];
      this.infor='Cập Nhật Danh '
    }
    for (let index = 0; index < array.length; index++) {
      const cusomer = array[index];
      console.log(cusomer)
      formArray.push(this.fb.group(cusomer));
    }
    this.form = this.fb.group({
      customers: formArray,
      // createdAt: [new Date(), Validators.required],
      // updatedAt: [new Date(), Validators.required],
    });
  }
  trackByFn(index: any) {
    return index;
  }
}
