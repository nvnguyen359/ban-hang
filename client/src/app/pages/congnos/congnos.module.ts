import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CongnosRoutingModule } from './congnos-routing.module';
import { CongnosComponent } from './congnos.component';


@NgModule({
  declarations: [
    CongnosComponent
  ],
  imports: [
    CommonModule,
    CongnosRoutingModule
  ]
})
export class CongnosModule { }
