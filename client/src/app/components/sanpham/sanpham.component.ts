import { Component, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SanPham } from "src/app/Models/sanPham";
import { delay } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
declare var capitalizeFirstLetter: any;
declare var removeAccents: any;
@Component({
  selector: "app-sanpham",
  templateUrl: "./sanpham.component.html",
  styleUrls: ["./sanpham.component.scss"],
})
export class SanphamComponent {
  formSubmit!: FormGroup;
  sanphams: any[] = [];
  dvts: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dataService: DataService,
    private service: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<SanphamComponent>
  ) {
    this.onSanPhams();
    this.formSubmit = fb.group({
      sanphams: fb.array([]),
    });
    let array = this.fb.array([]) as FormArray;
    if (data) {
      Array.from(data).forEach((sanpham: any) => {
        const item = fb.group({
          Id: sanpham["Id"],
          Name: [sanpham["Name"], Validators.required],
          "Giá Nhập": [sanpham["Giá Nhập"] || "", Validators.required],
          "Giá Bán": [sanpham["Giá Bán"] || "", Validators.required],
          "Đơn Vị Tính": [sanpham["Đơn Vị Tính"] || "", Validators.required],
        });
        array.push(item);
      });
    }
    this.formSubmit = fb.group({
      sanphams: !data ? fb.array([]) : array,
    });
    console.log(this.sanphams);
    const sps = this.sanphams.filter((x) => x["Đơn Vị Tính"] != undefined);
    this.dvts = [
      ...new Set(
        sps.map((x) => {
          return capitalizeFirstLetter(x["Đơn Vị Tính"]);
        })
      ),
    ];
  }
  ngOnInit() {}

  async onSubmit() {
    const array = this.formSubmit.value["sanphams"] as SanPham[];
    for (let i = 0; i < array.length; i++) {
      const sanpham = array[i];
      await delay();
      const url = "sanpham";
      let data: any;
      if (sanpham["Id"]) {
        data = await this.service.put(url, sanpham);
        this.snackBar.open("Cập Nhật Thành Công!");
      } else {
        data = await this.service.post(url, sanpham);
        array[i]["Id"] = data[0]["Id"];
        this.snackBar.open("Thêm Mới Thành Công!");
      }
    }
    //this.formSubmit.value["sanphams"] = array;
    this.dialogRef.close(array);
  }
  onSanPhams() {
    this.dataService.currentMessage.subscribe((result: any) => {
      if (result?.all) {
        this.sanphams = result.all["sanphams"];
      }
    });
  }
  onAdd() {
    const arr = this.formSubmit.controls["sanphams"] as FormArray;
    const item = this.fb.group({
      Id: "",
      Name: ["", Validators.required],
      "Giá Nhập": ["", Validators.required],
      "Giá Bán": ["", Validators.required],
      "Đơn Vị Tính": ["", Validators.required],
    });
    arr.push(item);
    this.scrollTop();
  }

  onDelete(index: number) {
    const array = this.formSubmit.controls["sanphams"] as FormArray;
    array.removeAt(index);
  }
  //==============================
  scrollTop() {
    setTimeout(() => {
      var element = document.getElementById("scrollTop-sanpham");
      if (element) {
        // window.scrollTo(0, 0);
        element.scrollTo({ top: element.scrollHeight, behavior: "instant" });
      }
    }, 200);
  }

  trackByFn(index: any) {
    return index;
  }
}
