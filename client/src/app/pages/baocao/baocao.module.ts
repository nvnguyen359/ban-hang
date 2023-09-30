import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaocaoRoutingModule } from './baocao-routing.module';
import { BaocaoComponent } from './baocao.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    BaocaoComponent
  ],
  imports: [
    CommonModule,
    BaocaoRoutingModule,
    MatCardModule
  ]
})
export class BaocaoModule { }
