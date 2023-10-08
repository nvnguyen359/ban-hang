import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { ListOrdersRoutingModule } from './list-orders-routing.module';
import { ListOrdersComponent } from './list-orders.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { StatusComponent } from 'src/app/components/status/status.component';


@NgModule({
  declarations: [
    ListOrdersComponent
  ],
  imports: [
    CommonModule,
    ListOrdersRoutingModule,
    MatTableModule,
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
    StatusComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class ListOrdersModule { }
