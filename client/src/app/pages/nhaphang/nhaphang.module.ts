import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhaphangRoutingModule } from './nhaphang-routing.module';
import { NhaphangComponent } from './nhaphang.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    NhaphangComponent
  ],
  imports: [
    CommonModule,
    NhaphangRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule ,
    MatExpansionModule,
    MatChipsModule,
    MatButtonModule
  ],schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class NhaphangModule { }
