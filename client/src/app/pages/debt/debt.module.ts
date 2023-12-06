import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtRoutingModule } from './debt-routing.module';
import { DebtComponent } from './debt.component';


@NgModule({
  declarations: [
    DebtComponent
  ],
  imports: [
    CommonModule,
    DebtRoutingModule
  ]
})
export class DebtModule { }
