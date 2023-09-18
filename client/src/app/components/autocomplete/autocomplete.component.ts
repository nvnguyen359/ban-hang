import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, map, startWith } from "rxjs";
declare var removeAccents: any;
@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
  standalone: false
})
export class AutocompleteComponent {
  filteredOptions?: Observable<any[]>;
  @Input() data: any;
  @Input() required: any = false;
  @Input() options: any = {
    name: "Name",
    showtext: "Name",
    label: "Sản Phẩm",
    placeholder: "Tìm Sản Phẩm",
  };
  @Output() selectTed = new EventEmitter<string>();
  @Output() nameText = new EventEmitter<string>();
  myControl = new FormControl("");

  constructor() {
   
  }
  ngOnInit() {
    
    //console.log(this.options);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filter(value || ""))
    );
  }
  private _filter(value: string): any {
    if (!value) {
      return this.data;
    } else {
      const filterValue = `${value}`.toLowerCase();
      return this.data.filter((option: any) =>
        removeAccents(option[this.options.showtext])
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
