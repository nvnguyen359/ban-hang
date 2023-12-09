import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhnRoutingModule } from './ghn-routing.module';
import { GhnComponent } from './ghn.component';


@NgModule({
  declarations: [
    GhnComponent
  ],
  imports: [
    CommonModule,
    GhnRoutingModule
  ]
})
export class GhnModule { }
