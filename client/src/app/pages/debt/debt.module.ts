import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { DebtRoutingModule } from './debt-routing.module';
import { DebtComponent } from './debt.component';
import { ExpansionTableComponent } from 'src/app/Components/expansion-table/expansion-table.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AutocompleteComponent } from 'src/app/Components/autocomplete/autocomplete.component';
import { InforCustomerInOrderComponent } from 'src/app/Components/infor-customer-in-order/infor-customer-in-order.component';
import { StatusComponent } from 'src/app/Components/status/status.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  declarations: [
    DebtComponent,
   
  ],
  imports: [
    CommonModule,
    DebtRoutingModule,
    ExpansionTableComponent,
    MatTableModule,
    MatTabsModule,
    AutocompleteComponent,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatRippleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    MatAutocompleteModule,
    StatusComponent,
    InforCustomerInOrderComponent,
    ExpansionTableComponent,
    ReactiveFormsModule,
    MatButtonToggleModule
  ]
})
export class DebtModule { }
