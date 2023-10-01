import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaocaoRoutingModule } from './baocao-routing.module';
import { BaocaoComponent } from './baocao.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    BaocaoComponent
  ],
  imports: [
    CommonModule,
    BaocaoRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class BaocaoModule { }
