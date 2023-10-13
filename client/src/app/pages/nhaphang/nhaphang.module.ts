import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhaphangRoutingModule } from './nhaphang-routing.module';
import { NhaphangComponent } from './nhaphang.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DisplayHeaderNhaphangPipe } from 'src/app/pipes/display-header-nhaphang.pipe';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    NhaphangComponent, DisplayHeaderNhaphangPipe
  ],
  imports: [
    CommonModule,
    NhaphangRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule ,
    MatExpansionModule,
    MatChipsModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule
  ],schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class NhaphangModule { }
