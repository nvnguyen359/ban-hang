import { Component, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { SanPham } from "src/app/Models/sanPham";
import { DialogAlertComponent } from "src/app/components/dialog-alert/dialog-alert.component";
import { BaseApiUrl } from "src/app/general";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-list-san-pham",
  templateUrl: "./list-san-pham.component.html",
  styleUrls: ["./list-san-pham.component.scss"],
})
export class ListSanPhamComponent {
  form: any = this.fb.group({
    sanphams: this.fb.array([]),
  });
  dvts: any = [];
  readonly = false;
  optionButtonUpdate: any = false;
  sanphams: any[] = [];
  optionSnackBar: any = {
    duration: 3000,
    horizontalPosition: "center",
    verticalPosition: "top",
  };
  update = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ListSanPhamComponent>
  ) {}
  ngOnInit() {
    this.sanphams = this.data.sanphams;
    this.dvts = [
      ...new Set(
        this.data.sanphams.map((x: any) =>
          `${x["Đơn Vị Tính"]}`.capitalizeFirstLetter()
        )
      ),
    ];
   // console.log(this.dvts);
    if (this.data.row) {
      this.update= true;
      const rows = Array.isArray(this.data.row)
        ? Array.from(this.data.row)
        : [this.data.row];
      this.readonly = true;
      this.optionButtonUpdate = true;
      rows.forEach((row: any) => {
        this.onAdd(row);
      });
    } else {
      this.update=false;
      this.readonly = false;
      this.onAdd();
    }
  }

  onSubmit() {
    if (this.update) {
      this.service
        .put(BaseApiUrl.SanpPhams, this.form.value.sanphams)
        .then((e: any) => {
          //console.log(e);
          this.snackBar.open("Cập Nhât Thành Công", "", this.optionSnackBar);
        });
    } else {
      this.service
        .post(BaseApiUrl.SanpPhams, this.form.value.sanphams)
        .then((e: any) => {
          this.dialogRef.close(e.data);
          this.snackBar.open("Thêm Mới Thành Công", "", this.optionSnackBar);
        });
    }
  }
  onAdd(item?: any) {
    // console.log(item);
    const arr = this.form.controls["sanphams"] as FormArray;
    arr.push(
      this.fb.group({
        Id: [item ? item["Id"] : ""],
        Name: [item ? item["Name"] : "", Validators.required],
        "Giá Bán": [item ? item["Giá Bán"] : 0, Validators.required],
        "Đơn Vị Tính": [item ? item["Đơn Vị Tính"] : ""],
        "Giá Nhập": [item ? item["Giá Nhập"] : 0, Validators.required],
      })
    );
  }
  onDelete(index: number) {
    const chitiet = this.form.controls["sanphams"].at(index).value;
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      data: `Bạn Chắc Chắn Xóa [${chitiet["Name"]}]?`,
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.service
          .destroy(BaseApiUrl.SanpPhams, chitiet["Id"])
          .then((result: any) => {
            this.dialogRef.close(result.data);
            this.form.controls["sanphams"].removeAt(index);
          });
      }
    });
  }

  onChange(ele?: any, sanpham?: any) {
    let value = ele.target.value;
    const sanphams = this.sanphams.find((x: SanPham) => x["Name"] == value);
    if (sanphams) {
      const dialogRef = this.dialog.open(DialogAlertComponent, {
        data: "Sản Phẩm có trong danh sách!",
      });
      dialogRef.afterClosed().subscribe((e: any) => (ele.target.value = ""));
    }
  }
  trackByFn(index: any) {
    return index;
  }
}
