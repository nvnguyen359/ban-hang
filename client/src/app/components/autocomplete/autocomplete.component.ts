import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Observable, map, startWith } from "rxjs";
import { CommonModule, NgFor } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from "@angular/core";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { Fields } from "src/app/Models/field";
import { BaseApiUrl, fields } from "src/app/general";
import { DynamicUpsertComponent } from "../dynamic-upsert/dynamic-upsert.component";
import { DataService } from "src/app/services/data.service";

declare var removeAccents: any;
@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
  imports: [
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    NgFor,
    MatAutocompleteModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AutocompleteComponent {
  filteredOptions?: Observable<any[]>;
  @Input() data: any;
  @Input() default: any = null;
  @Input() required: any = false;
  @Input() options: any = {
    name: "name",
    showtext: "name",
    label: "Sản Phẩm",
    placeholder: "Tìm Sản Phẩm",
    banks: "",
    url: "",
  };
  @Output() selectTed = new EventEmitter<string>();
  @Output() nameText = new EventEmitter<string>();
  @Output() keyUp = new EventEmitter<string>();

  myControl = new FormControl("");
  valueKeyup = "";
  constructor(private dialog: MatDialog) {}
  ngOnInit() {
    console.log(this.options);
    //console.log(this.data)
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filter(value || ""))
    );
  }
  private _filter(value: string): any {
    if (!value) {
      return Array.from(this.data);
    } else {
      const filterValue = `${value}`.toLowerCase();
      return Array.from(this.data)
        .reverse()
        .filter((option: any) =>
          removeAccents(option[this.options.name])
            .toLowerCase()
            .includes(removeAccents(filterValue))
        );
    }
  }
  onSelection(item: any) {
    this.selectTed.emit(item);
  }
  onKeyup(item: any) {
    this.nameText.emit(item.target.value);
    this.keyUp.emit(item.target.value);
    this.valueKeyup = item.target.value;
  }
  onNewProduct() {
    if (this.options.url) {
      const columns = ["name", "phone", "address", "email"];
      const columnDate = ["createdAt", "updatedAt"];
      //console.log(this.valueKeyup);
      const obj = {
        id: "",
        name: [this.valueKeyup, Validators.required],
        phone: ["", Validators.required],
        address: [""],
        email: "",
      };
      let fieldFilter = (fields() as Fields[]).filter((x: Fields) =>
        columns.concat(columnDate).includes(x.field)
      );
      fieldFilter = (fields() as Fields[]).filter((x: any) =>
        columns.includes(x.field)
      );
      this.dialog.open(DynamicUpsertComponent, {
        data: {
          value: [],
          fields: fieldFilter,
          obj,
          url: BaseApiUrl.KhachHangs,
          numberRow: 1,
        },
      });
    }
  }
}
