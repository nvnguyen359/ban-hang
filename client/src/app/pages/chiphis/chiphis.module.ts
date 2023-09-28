import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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


@NgModule({
  declarations: [
    ChiphisComponent
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
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChiphisModule { }
