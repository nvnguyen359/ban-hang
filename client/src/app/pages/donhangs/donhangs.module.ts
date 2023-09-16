import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';

import { DonhangsRoutingModule } from './donhangs-routing.module';
import { DonhangsComponent } from './donhangs.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DialogModule } from '@angular/cdk/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BangmorongModule } from 'src/app/components/bangmorong/bangmorong.module';
import {MatCheckboxModule} from '@angular/material/checkbox';



@NgModule({
  declarations: [
    DonhangsComponent
  ],
  imports: [
    CommonModule,
    DonhangsRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    DialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    BangmorongModule,
    FormsModule,
    MatCheckboxModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports:[DonhangsComponent]
})
export class DonhangsModule { }
