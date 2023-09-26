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
import { BaseApiUrl, Status, delay, scrollTop } from "src/app/general";
import { async } from "@angular/core/testing";

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
  sanphams: any[] = [];
  nhaphangs: NhapHang[] = [];
  optionButtonUpdate = false;
  dvts: any[] = [];
  readonly = false;
  removeAts: any = [];
  title = "Nhập Hàng";
  constructor(
    public dialogRef: MatDialogRef<OnNhapHangComponent>,
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
    // this.getDataService();
    this.insertNhaphangs();
  }
  ngOninit() {
    // this.insertNhaphangs();
    // this.getDataService();
  }
  initSelect() {
    this.sanphams = this.data["sanphams"];
    this.dvts = [
      ...new Set(
        Array.from(this.sanphams).map((e: any) =>
          `${e["Đơn Vị Tính"]}`.capitalizeFirstLetter()
        )
      ),
    ];
  }
  insertNhaphangs() {
    if (this.data && Array.from(this.data["nhaphangs"]).length > 0) {
      this.readonly = true;
      this.optionButtonUpdate = true;
      const formArray = this.fb.array([]) as FormArray;
      this.nhaphangs = this.data["nhaphangs"];
      this.initSelect();
      Array.from(this.nhaphangs).forEach((nhaphang: any) => {
        formArray.push(this.fb.group(nhaphang));
      });

      this.form = this.fb.group({
        "Ngày Nhập": [
          `${this.nhaphangs[0]["Ngày Nhập"]}`.convertDateVNToISO(),
          Validators.required,
        ],
        nhaphangs: formArray,
      });
    } else {
      this.initSelect();
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
    let val = event.target.value;
    const nhs1 = this.form.value["nhaphangs"];
    const checkSanPhams = nhs1.filter(
      (e: any) => e["Tên sản phẩm"] != "" && e["Tên sản phẩm"] == val
    );

    if (checkSanPhams.length > 1) {
      const dialogRef = this.dialog.open(DialogAlertComponent, {
        data: `${val} bị trùng!`,
      });
      dialogRef.afterClosed().subscribe((e: any) => {
        event.target.value = "";
      });
      return;
    }

    let values = this.form.value;
    let nhs = Array.from(values["nhaphangs"]);
    nhs.forEach((e: any, i: number) => {
      const sanpham = Array.from(this.sanphams as any[]).find(
        (x: any) => x["Name"] == val
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
  }
  onDelete(index: number, nhaphang: any) {
    const ctrl = this.form.controls["nhaphangs"];
    const value = ctrl.value;
    const removeItem = ctrl.value.at(index);
    if (removeItem["Id"] != "") this.removeAts.push(removeItem);
    ctrl.setValue(
      value
        .slice(0, index)
        .concat(value.slice(index + 1))
        .concat(value[index])
    );
    ctrl.removeAt(value.length - 1);
    return;
  }
  updateOrCreateNhapHangs() {
    let nhapHangs = this.form.value["nhaphangs"];
    let posts: any = [];
    let puts: any = [];

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
          checkEdit["Ngày Nhập"] = this.form.value["Ngày Nhập"];
          puts.push(checkEdit);
          // const result = (await this.service.put(url, nh)) as any;
          // data.push(result.data.data);
        }
      }
      if (!nh["Id"]) {
        //  const result = (await this.service.post(url, nh)) as any;
        nh["Name"] = nh["Tên sản phẩm"];
        posts.push(nh);
      }
    }
    return { puts, posts };
  }
  async onSubmit() {
    console.log("submit");
    let data: any = [];
    const sanPhams = this.updatePriceOrCreateProduct();
    await this.service.put(BaseApiUrl.SanpPhams, sanPhams.puts);
    const nhaps = this.updateOrCreateNhapHangs();
    await this.service.put(BaseApiUrl.NhapHangs, nhaps.puts);
    if (nhaps.posts.length > 0) {
      for (let i = 0; i < nhaps.posts.length; i++) {
        let item = nhaps.posts[i];
        const sp = (await this.service.post(BaseApiUrl.SanpPhams, item)) as any;
        item["Sản Phẩm"] = sp.data[0]["Id"];
        await this.service.post(BaseApiUrl.NhapHangs, item);
      }
    }
    if (this.removeAts.length > 0) {
      const ids = this.removeAts
        .map((x: any) => {
          return x["Id"];
        })
        .filter((x: any) => x != undefined);
      const nameS = this.removeAts.map(
        (x: any) => x["Tên sản phẩm"]
      ) as string[];
      if (ids.length > 0) {
        const dialog = this.dialog.open(DialogAlertComponent, {
          data: `Bạn chắc chắn muốn xóa [${nameS.join()}]`,
        });
      const result= await dialog.afterClosed().toPromise();
      if (result) {
        await this.service.bulkDelete(BaseApiUrl.NhapHangs, ids);
      }
      }
    }
   this.dataService.sendMessage(Status.Refesh);
    // if (sanPhams.puts.length > 0) {
    //   this.dataService.sendMessage({ status: Status.Refesh, dataUpdate: data });
    // }
  }
  updatePriceOrCreateProduct() {
    let nhapHangs = this.form.value["nhaphangs"];
    // console.log("updatePriceOrCreateProduct");
    let posts: any = [];
    let puts: any = [];
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
        // data.push(sanpham);
        puts.push(sanpham);
        // this.service.put("sanpham", sanpham);
      }
      if (!nh["Sản Phẩm"]) {
        nh["Id"] = "";
        nh["Name"] = nh["Tên sản phẩm"];
        posts.push(nh);
        // this.service.post("sanpham", nh);
      }
    }
    return { posts, puts };
  }
  onKeyup(nhaphang: any) {
    console.log(nhaphang);
  }
  trackByFn(index: any) {
    return index;
  }
}
