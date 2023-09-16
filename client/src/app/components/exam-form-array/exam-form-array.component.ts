import { Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from "@angular/forms";

@Component({
  selector: "app-exam-form-array",
  templateUrl: "./exam-form-array.component.html",
  styleUrls: ["./exam-form-array.component.scss"],
})
export class ExamFormArrayComponent {
  public dataList = [
    { name: "Alice", text: "ok" },
    { name: "Bob", text: "haha" },
  ];

  public form: FormGroup;
  items!: FormArray;
  constructor(private _fb: FormBuilder) {
    const formArray:FormArray = this._fb.array([]) ;

    for (const data  of this.dataList) {
      let t = data as any
      const keys = Object.keys(data);
      let obj:any={};
      keys.forEach((key: any) => {
        //obj[key] = new FormControl(t[key]);
        obj[key] =t[key];
      });
      formArray.push(this._fb.group(obj));
    }

    this.form = this._fb.group({
      offers: formArray,
    });
  }
  trackByFn(index:number) {
    return index;
  }
  createItem(): FormGroup {
    return this._fb.group({
      name:  new FormControl('ok'),
      text: 'ok'
    });
  }
  addItem(): void {
    this.items = this.form.get('offers') as FormArray;
    this.items.push(this.createItem());
  }
}
