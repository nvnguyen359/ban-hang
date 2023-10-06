import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaocaoRoutingModule } from './baocao-routing.module';
import { BaocaoComponent } from './baocao.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { DonutProductComponent } from 'src/app/components/donut-product/donut-product.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOrderComponent } from 'src/app/components/chart-order/chart-order.component';
const MY_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY", // this is how your date will be parsed from Input
  },
  display: {
    dateInput: "DD/MM/YYYY", // this is how your date will get displayed on the Input
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
  MAT_DATE_LOCALE:'vi-VN'
};
@NgModule({
  declarations: [
    BaocaoComponent,
    DonutProductComponent,
    ChartOrderComponent
  ],
  imports: [
    CommonModule,
    BaocaoRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    NgApexchartsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[{ provide: MAT_DATE_LOCALE, useValue: 'vi-VN' }]
})
export class BaocaoModule { }
