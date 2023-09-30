import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { ChiphisRoutingModule } from './chiphis-routing.module';
import { ChiphisComponent } from './chiphis.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AutocompleteComponent } from 'src/app/components/autocomplete/autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { IsNumberPipe } from 'src/app/pipes/is-number.pipe';


@NgModule({
  declarations: [
    ChiphisComponent,IsNumberPipe
  ],
  imports: [
    CommonModule,
    ChiphisRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule ,
    MatExpansionModule,
    MatChipsModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,MatAutocompleteModule,
    MatTableModule, NgFor, MatButtonModule, NgIf,
    MatCardModule
  ],schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ChiphisModule { }
