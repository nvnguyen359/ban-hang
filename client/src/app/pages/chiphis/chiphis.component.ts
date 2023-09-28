import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-chiphis',
  templateUrl: './chiphis.component.html',
  styleUrls: ['./chiphis.component.scss']
})
export class ChiphisComponent {
  siteForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.siteForm = fb.group({
      contacts: fb.array([])
    });
  }
  setContacts(value: any): FormGroup {
    return this.fb.group({
      type: [value.type ? value.type  : '']
    });
  }
  trackByFn(index: any, item: any) {
    return index;
  }
  addContact() {
    const ctrl = this.siteForm.controls['contacts'] as FormArray;
    ctrl.push(this.setContacts({type: '', contact: null}))
  }
  deleteContact(position: any) {
   const ctrl = this.siteForm.controls['contacts'] as FormArray;
    //ctrl.removeAt(position);
    const value = ctrl.value;

    ctrl.setValue(
      value.slice(0, position).concat(
        value.slice(position + 1),
      ).concat(value[position]),
    );
  
   ctrl.removeAt(value.length - 1);
  }
}
