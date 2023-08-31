import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhaphangRoutingModule } from './nhaphang-routing.module';
import { NhaphangComponent } from './nhaphang.component';


@NgModule({
  declarations: [
    NhaphangComponent
  ],
  imports: [
    CommonModule,
    NhaphangRoutingModule
  ]
})
export class NhaphangModule { }
