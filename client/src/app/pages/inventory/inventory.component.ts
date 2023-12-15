import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {
  columns = ["name", "sumImport", "sumOuput", "inventory", "valueImport","valueOut","profit"];

  options: any = {
    displayedColumns: ["no", ...this.columns],
    
  };
}
