import { Component, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { SanPham } from "src/app/Models/sanPham";
import { NhapHang } from "src/app/Models/nhapHang";
import { DataService } from "src/app/services/data.service";
import { DialogModule } from "@angular/cdk/dialog";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";
import { isEmpty } from "rxjs";
import { ProductComponent } from "../product/product.component";
import { ApiService } from "src/app/services/api.service";
import { Status, delay, scrollTop } from "src/app/general";

@Component({
  selector: "app-on-nhap-hang",
  templateUrl: "./on-nhap-hang.component.html",
  styleUrls: ["./on-nhap-hang.component.scss"],
})
//Id	Tên sản phẩm	Sản Phẩm	Số Lượng	Đơn Vị Tính	Giá Nhập	Giá Bán
export class OnNhapHangComponent {
  form: any = this.fb.group({
    "Ngày Nhập": [new Date(), Validators.required],
    nhaphangs: this.fb.array([]),
  });
  sanphams?: SanPham[] = [];
  nhaphangs: NhapHang[] = [];
  optionButtonUpdate = false;
  dvts: any[] = [];
  title = "Nhập Hàng";
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dataService: DataService,
    private service: ApiService
  ) {
    this.form = this.fb.group({
      "Ngày Nhập": [new Date(), Validators.required],
      nhaphangs: this.fb.array([]),
    });
    this.getDataService();
    this.insertNhaphangs();
  }
  ngOninit() {
    // this.insertNhaphangs();
    // this.getDataService();
  }
  insertNhaphangs() {
    if (this.data && Array.from(this.data).length > 0) {
      this.optionButtonUpdate = true;
      const formArray = this.fb.array([]) as FormArray;
      this.nhaphangs = this.data;
      Array.from(this.data).forEach((nhaphang: any) => {
        formArray.push(this.fb.group(nhaphang));
      });
      this.form = this.fb.group({
        "Ngày Nhập": [
          `${this.data[0]["Ngày Nhập"]}`.convertDateVNToISO(),
          Validators.required,
        ],
        nhaphangs: formArray,
      });
    } else {
      for (let index = 0; index < 5; index++) {
        this.addRow();
      }
    }
  }
  getDataService() {
    this.dataService.currentMessage.subscribe((result: any) => {
      const dt = result.all;
      if (dt) {
        this.sanphams = dt["sanphams"];
        this.dvts = [
          ...new Set(
            Array.from(dt["sanphams"]).map((e: any) =>
              `${e["Đơn Vị Tính"]}`.capitalizeFirstLetter()
            )
          ),
        ];
      }
    });
  }
  addRow() {
    const creds = this.form.controls["nhaphangs"] as FormArray;
    creds.push(
      this.fb.group({
        Id: "",
        "Tên sản phẩm": ["", Validators.required],
        "Sản Phẩm": "",
        "Số Lượng": [1, Validators.required],
        "Đơn Vị Tính": ["", Validators.required],
        "Giá Nhập": ["", Validators.required],
        "Giá Bán": ["", Validators.required],
        "Thành tiền": [""],
      })
    );
    scrollTop(".nhap-hang");
  }

  onChangeSanPham(event: any, index: any) {
    let values = this.form.value;
    let nhs = Array.from(values["nhaphangs"]);
    nhs.forEach((e: any, i: number) => {
      const sanpham = Array.from(this.sanphams as any[]).find(
        (x: any) => x["Name"] == event.target.value
      ) as any;
      if (sanpham && i == index) {
        e["Giá Nhập"] = sanpham["Giá Nhập"];
        e["Giá Bán"] = sanpham["Giá Bán"];
        e["Sản Phẩm"] = sanpham["Sản Phẩm"];
        e["Đơn Vị Tính"] = sanpham["Đơn Vị Tính"];
        e["Thành tiền"] =
          parseInt(sanpham["Giá Nhập"]) * parseInt(e["Số Lượng"]);
        e["Sản Phẩm"] = sanpham["Id"];
      }
    });
    values["nhaphangs"] = nhs;
    this.form.patchValue(values);
    const nhs1 = this.form.value["nhaphangs"];

    const checkSanPhams = nhs1.filter(
      (e: any) =>
        e["Tên sản phẩm"] != "" && e["Tên sản phẩm"] == event.target.value
    );

    if (checkSanPhams.length > 1) {
      const ten = event.target.value;
      const dialogRef = this.dialog.open(DialogAlertComponent, {
        data: `${ten} bị trùng!`,
      });
      dialogRef.afterClosed().subscribe((e: any) => {
        event.target.value = "";
      });
    }
  }
  onDelete(index: number) {
    const chitiet = this.form.controls["nhaphangs"].at(index).value;
    //console.log(index,chitiet)
    (this.form.controls["nhaphangs"] as FormArray).removeAt(index);
    return
    if (!chitiet["Id"]) {
      this.form.controls["nhaphangs"].removeAt(index);
      return;
    } else {
      const dialogRef = this.dialog.open(DialogAlertComponent, {
        data: `Bạn Chắc Chắn Xóa [${chitiet["Tên sản phẩm"]}] ra khỏi nhập hàng hôm nay ?`,
      });
      dialogRef.afterClosed().subscribe((data: boolean) => {
        if (data) {
          this.form.controls["nhaphangs"].removeAt(index);
          // this.dialogRef.close();
          // this.service
          //   .destroy("nhaphang", chitiet["Id"])
          //   .then((result: any) => {
          //     // console.log(result)
          //     if (result) this.form.controls["nhaphangs"].removeAt(index);
          //     this.dataService.sendMessage({
          //       status: Status.Refesh,
          //       nhaphang: result.data,
          //     });
          //   });
        }
      });
    }
  }
  async onSubmit() {
    console.log("submit");
    let nhapHangs = this.form.value["nhaphangs"];
    const url = "nhaphang";
    let data: any = [];
    this.updatePriceOrCreateProduct(nhapHangs);
    for (let i = 0; i < nhapHangs.length; i++) {
      const nh = nhapHangs[i];
      nh["Ngày Nhập"] = this.form.value["Ngày Nhập"];
      if (nh["Id"]) {
        const checkEdit = this.nhaphangs.find(
          (x: any) =>
            x["Id"] == nh["Id"] &&
            (x["Số Lượng"] != nh["Số Lượng"] ||
              x["Giá Bán"] != nh["Giá Bán"] ||
              x["Giá Nhập"] != nh[`Giá Nhập`])
        );
        if (checkEdit) {
          const result = (await this.service.put(url, nh)) as any;
          data.push(result.data.data);
        }
      }
      if (!nh["Id"]) {
        const result = (await this.service.post(url, nh)) as any;
        data.push(result.data[0]);
      }
      await delay(100);
    }

    //this.dialogRef.close(data)
    if (data.length > 0) {
      this.dataService.sendMessage({ status: Status.Refesh, dataUpdate: data });
    }
  }
  updatePriceOrCreateProduct(nhapHangs: any) {
    // console.log("updatePriceOrCreateProduct");
    let data: any = [];
    for (let i = 0; i < nhapHangs.length; i++) {
      const nh = nhapHangs[i];
      let sanpham = Array.from(this.sanphams as any[]).find(
        (x: any) =>
          x["Name"] == nh["Tên sản phẩm"] &&
          (x["Giá Nhập"] != nh["Giá Nhập"] || x["Giá Bán"] != nh["Giá Bán"])
      ) as any;

      if (sanpham) {
        sanpham["Id"] = nh["Sản Phẩm"];
        sanpham["Giá Nhập"] = nh["Giá Nhập"];
        sanpham["Giá Bán"] = nh["Giá Bán"];
        sanpham["Đơn Vị Tính"] = nh["Đơn Vị Tính"];
        sanpham["Name"] = nh["Tên sản phẩm"];
        data.push(sanpham);
        this.service.put("sanpham", sanpham);
      }
      if (!nh["Sản Phẩm"]) {
        nh["Id"] = "";
        nh["Name"] = nh["Tên sản phẩm"];
        data.push(nh);
        this.service.post("sanpham", nh);
      }
    }
  }
  onKeyup(nhaphang: any) {
    console.log(nhaphang);
  }
  trackByFn(index: any) {
    return index;
  }
}
