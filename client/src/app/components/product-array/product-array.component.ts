import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-product-array",
  templateUrl: "./product-array.component.html",
  styleUrls: ["./product-array.component.scss"],
})
export class ProductArrayComponent {
  skills = new FormArray(new Array());
  sanphams: any;
  constructor(private fb: FormBuilder, private serviceApi: ApiService) {
    this.getSanphams();
  }
  getSanphams() {
    this.serviceApi.get("sanpham").then((e: any) => {
      console.log(e);
    });
  }
  addSkill() {
    const group: FormGroup = new FormGroup({
      "Sản Phẩm": new FormControl("", Validators.required),
      "Số Lượng": new FormControl(""),
      "Giá Nhập": new FormControl("", Validators.required),
      "Giá Bán": new FormControl("", Validators.required),
      "Thuộc Nhóm": new FormControl(""),
    });

    this.skills.push(group);
  }
}
