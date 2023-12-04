import { AsyncPipe, CommonModule, NgFor, NgForOf, NgIf } from "@angular/common";
import {
  Component,
  Inject,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FormBuilder,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
} from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { Fields } from "src/app/Models/field";
import { BaseApiUrl, Status, delay, links } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { Observable, map, startWith } from "rxjs";
declare var removeAccents: any;
@Component({
  selector: "app-dynamic-upsert",
  templateUrl: "./dynamic-upsert.component.html",
  styleUrls: ["./dynamic-upsert.component.scss"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    NgFor,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    MatDatepickerModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgForOf,
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class DynamicUpsertComponent {
  form: any;
  removeAts: any[] = [];
  infor = "Thêm Khách Hàng Mới";
  fieldsShow: any;
  fieldsHidden: any;
  itemsDelete: any = [];
  products: any = [];
  units: any = [];
  url = "";
  filteredOptionsUnit: any = [];
  filteredOptionsNames: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private service: ApiService,
    private dialogRef: MatDialogRef<DynamicUpsertComponent>,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.url = this.router.url.replace("/", "").trim();
    if (this.router.url.includes(BaseApiUrl.ChiPhis)) {
      this.service.get(BaseApiUrl.ChiPhis).then((e: any) => {
        this.filteredOptionsNames = e.items;
      });
    }
    this.initForm();
    if (this.url == BaseApiUrl.SanpPhams || this.url == BaseApiUrl.NhapHangs) {
      this.service.get(BaseApiUrl.SanpPhams).then((e: any) => {
        this.products = e.items;
        this.units = [
          ...new Set(
            this.products.map((x: any) => {
              if (`${x.unit}`.trim() != "") {
                return x.unit[0].toUpperCase() + x.unit.slice(1);
              }
            })
          ),
        ];
        this.filteredOptionsUnit = this.units;
        this.filteredOptionsNames = this.products;
      });
    }
  }
  onKeyUpUnit(event: any) {
    this.filteredOptionsUnit = this.units.filter((option: any) =>
      removeAccents(option.toLowerCase()).includes(
        removeAccents(event.target.value.toLowerCase())
      )
    );
  }
  onKeyUpName(event: any) {
    this.filteredOptionsNames = this.products.filter((option: any) =>
      removeAccents(option.name.toLowerCase()).includes(
        removeAccents(event.target.value.toLowerCase())
      )
    );
  }

  initForm() {
    let formArray = this.fb.array([]) as FormArray;
    let array: any = [];
    this.fieldsShow = (this.data.fields as Fields[]).filter(
      (x: Fields) => x.type != "hidden"
    );
    this.fieldsHidden = (this.data.fields as Fields[]).filter(
      (x: Fields) => x.type == "hidden"
    );
    if (Array.from(this.data.value).length > 0) {
      array = Array.isArray(this.data.value)
        ? Array.from(this.data.value)
        : [this.data.value];
      this.infor = `Cập Nhật ${
        links().find((x: any) => x.link.includes(this.router.url))?.text
      }`;
      for (let index = 0; index < array.length; index++) {
        const customer = array[index];
        formArray.push(this.fb.group(customer));
      }
      this.form = this.fb.group({
        formArray: formArray,
      });
    } else {
      this.infor = `Thêm Mới ${
        links().find((x: any) => x.link.includes(this.router.url))?.text
      }`;
      this.form = this.fb.group({
        formArray: formArray,
        createdAt: [new Date(), Validators.required],
      });
      this.onAdd();
      this.onAdd();
      this.onAdd();
    }
  }
  onAdd() {
    const arr = this.form.controls["formArray"] as FormArray;
    let obj = this.data.obj;
    //  console.log(obj);
    arr.push(this.fb.group(obj));
    this.scrollTop();
  }
  async onSubmit() {
    const array = this.form.value?.formArray.map((x: any) => {
      x.updatedAt = new Date();
      if (this.data.obj) x.createdAt = new Date(this.form.value.createdAt);
      if (x.productId)
        x.intoMoney = parseInt(x.quantity) * parseInt(x.importPrice);
      if (x.id == null) x.id = "";
      return x;
    }) as any[];
    console.log(array);
    const arrUpdate = array.filter((x: any) => x.id != "");
    const arrCreate = array.filter((x: any) => x.id == "");

    if (arrUpdate.length > 0) {
      for (let index = 0; index < arrUpdate.length; index++) {
        const element = arrUpdate[index];
        //     console.log(element);
        const result = await this.service.update(this.url, element);
        console.log(result);
        await delay(200);
      }
    }
    if (arrCreate.length > 0) {
      console.log("create");
      await this.service.create(this.url, arrCreate);
    }
    if (this.itemsDelete.length > 0) {
      this.service.bulkDelete(this.url, this.itemsDelete);
    }
    this.dialogRef.close(true);
    this.dataService.sendMessage({ status: Status.Refesh });
  }

  onDeleteItem() {}
  onDelete(index: any) {
    const ctrl = this.form.controls["formArray"];
    const value = ctrl.value;
    const removeItem = ctrl.value.at(index);
    if (removeItem.id) this.itemsDelete.push(removeItem);
    if (removeItem["id"] != "") this.removeAts.push(removeItem);
    ctrl.setValue(
      value
        .slice(0, index)
        .concat(value.slice(index + 1))
        .concat(value[index])
    );
    ctrl.removeAt(value.length - 1);
    return;
  }
  optionSelectedProductName(item: any, index: any) {
    const value = item.option.value as any;
    let product = Array.from(this.products).find(
      (x: any) => x.name == value
    ) as any;
    if (!product) return;
    const arr = this.form.controls["formArray"].value.map((x: any) => {
      if (x.name == product.name) {
        product.productId = product.id;
        product.id = !x.id ? "" : x.id;
        return product;
      } else {
        return x;
      }
    });
    this.form.controls["formArray"].patchValue(arr);
    return;
  }
  trackByFn(index: any) {
    return index;
  }
  onShow(item: any, field: any) {
    //console.log(item.field == field, item.field);
    return item.field == field;
  }
  onShowName(item: any): boolean {
    return this.url == BaseApiUrl.NhapHangs ;
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.scrollTop();
  }

  scrollTop() {
    setTimeout(() => {
      var element = document.getElementById("scrollTop");
      if (element) {
        // window.scrollTo(0, 0);
        element.scrollTo({ top: element.scrollHeight, behavior: "instant" });
      }
    }, 200);
  }
  max50(item: any) {
    let result = "";
    switch (item.field) {
      case "quantity":
        {
          result = "max-width50";
        }
        break;
      case "unit":
        {
          result = "max-width50";
        }
        break;
      default:
        {
          result = "";
        }
        break;
    }
    return result;
  }
  onShowChiPhi(item: any) {
    return this.url == BaseApiUrl.ChiPhis;
  }
}
