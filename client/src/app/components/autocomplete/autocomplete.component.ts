
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Observable, map, startWith } from "rxjs";
import { CommonModule, NgFor } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output
} from "@angular/core";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";

declare var removeAccents: any;
@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
  imports:[MatSelectModule, MatIconModule, MatOptionModule, NgFor,MatAutocompleteModule,CommonModule ,ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,MatButtonModule],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AutocompleteComponent {
  filteredOptions?: Observable<any[]>;
  @Input() data: any;
  @Input() default: any=null;
  @Input() required: any = false;
  @Input() options: any = {
    name: "name",
    showtext: "name",
    label: "Sản Phẩm",
    placeholder: "Tìm Sản Phẩm",
  };
  @Output() selectTed = new EventEmitter<string>();
  @Output() nameText = new EventEmitter<string>();
  myControl = new FormControl("");

  constructor() {
  // console.log(this.options)
  }
  ngOnInit() {
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
      return Array.from(this.data).reverse().filter((option: any) =>
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
  }
}
