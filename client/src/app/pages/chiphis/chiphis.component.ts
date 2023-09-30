import { SelectionModel } from "@angular/cdk/collections";
import {
  ChangeDetectorRef,
  Component,
  Injectable,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from "@angular/material/table";
import { Router } from "@angular/router";
import { Observable, map, startWith } from "rxjs";
import { ChiPhi } from "src/app/Models/chiPhi";
import { SanPham } from "src/app/Models/sanPham";
import { BaseApiUrl } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import "./../../lib.extensions";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { NgFor, NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
declare var removeAccents: any;
@Component({
  selector: "app-chiphis",
  templateUrl: "./chiphis.component.html",
  styleUrls: ["./chiphis.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ChiphisComponent {
  siteForm: FormGroup;
  @ViewChild(MatTable) table: MatTable<ChiPhi> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource?: any;
  displayedColumns = ["Index", "Name", "Đơn Vị Tính", "Giá Nhập", "Giá Bán"];
  selection = new SelectionModel<any>(true, []);
  formSubmit: any = this.fb.group({
    Tên: this.fb.control("", Validators.required),
    "Số Tiền": this.fb.control("", Validators.required),
    "Ghi Chú": this.fb.control(""),
    Id: [""],
    Ngày: this.fb.control(new Date(), Validators.required),
  });
  getId: any = "";
  names: any[] = [];
  filteredNames?: Observable<any[]>;
  columnsToDisplay = ["Ngày", "Tổng Chi"];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
  expandedElement: any | null;
  constructor(
    private fb: FormBuilder,
    private service: ApiService,
    private router: Router,
    private readonly dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.siteForm = fb.group({
      contacts: fb.array([]),
    });
  }
  ngOnInit() {
    // this.formSubmit= this.fb.group({
    //   'Tên':['', Validators.required],
    //   'Số Tiền':['', Validators.required],
    //   'Ghi Chú':[''],
    //   'Ngày':[new Date(), Validators.required],
    // })
    this.filteredNames = this.formSubmit.controls["Tên"].valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filter(value || ""))
    );
    this.getAll();
  }
  async onSubmit() {
    const value = this.formSubmit.value;
    let data:any =value["Id"]?await this.service.put(BaseApiUrl.ChiPhis, value):await this.service.post(BaseApiUrl.ChiPhis, value);
    console.log(data)
    setTimeout(() => {
      this.getAll(true);
    }, 800);
  }
  onSelect(item: any) {
    this.getId = item["Id"];
    item["Ngày"] = `${item["Ngày"]}`.convertDateVNToISO();
    this.formSubmit.patchValue(item);
  }
 async onDelete() {
    const value = this.formSubmit.value;
    await this.service.destroy(BaseApiUrl.ChiPhis, value["Id"]);
  }
  onReset(){
    this.formSubmit.controls['Ngày'].setValue(new Date())
  }
  private _filter(value: string): any {
    if (!value) {
      return this.names;
    } else {
      const filterValue = `${value}`.toLowerCase();
      return this.names.filter((option: any) =>
        removeAccents(option).toLowerCase().includes(removeAccents(filterValue))
      );
    }
  }
  getAll(refesh = false) {
    this.service.get(BaseApiUrl.ChiPhis).then((e) => {
      const chiphis = (e as ChiPhi[]).map((x: ChiPhi) => {
        x["Ngày"] = `${x["Ngày"]}`.DateFormatDDMMYYY();
        return x;
      });
      this.names = [...new Set(chiphis.map((x: any) => x["Tên"]))];
      const dates = [
        ...new Set(chiphis.map((x: ChiPhi) => x["Ngày"])),
      ].reverse();
      let data: any[] = [];
      dates.forEach((date) => {
        const details = chiphis.filter((x: ChiPhi) => x["Ngày"] == date);
        const indexs = details.map((x: any, index: any) => {
          x["index"] = index + 1;
          return x;
        });
        const tongchi = details
          .map((x: ChiPhi) => x["Số Tiền"])
          .reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0);
        const item = { Ngày: date, details: indexs, "Tổng Chi": tongchi };
        data.push(item);
      });
      if (!refesh) {
        this.dataSource = new MatTableDataSource<any>(data);
      } else {
        this.dataSource.data = data;
      }

      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function (record: any, filter: string) {
        return record["Tên"]
          .removeAccents()
          .toLowerCase()
          .includes(filter.removeAccents().toLowerCase());
      };

      this.changeDetectorRefs.detectChanges();
    });
  }

  setContacts(value: any): FormGroup {
    return this.fb.group({
      type: [value.type ? value.type : ""],
    });
  }
  trackByFn(index: any, item: any) {
    return index;
  }
  addContact() {
    const ctrl = this.siteForm.controls["contacts"] as FormArray;
    ctrl.push(this.setContacts({ type: "", contact: null }));
  }
  deleteContact(position: any) {
    const ctrl = this.siteForm.controls["contacts"] as FormArray;
    //ctrl.removeAt(position);
    const value = ctrl.value;

    ctrl.setValue(
      value
        .slice(0, position)
        .concat(value.slice(position + 1))
        .concat(value[position])
    );

    ctrl.removeAt(value.length - 1);
  }
}
