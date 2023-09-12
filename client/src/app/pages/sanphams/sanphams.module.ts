import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanphamsRoutingModule } from './sanphams-routing.module';
import { SanphamsComponent } from './sanphams.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductArrayComponent } from 'src/app/components/product-array/product-array.component';


@NgModule({
  declarations: [
    SanphamsComponent, ProductArrayComponent
  ],
  imports: [
    CommonModule,
    SanphamsRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule ,
    MatExpansionModule,
    MatChipsModule,
    MatButtonModule,
   
  ],schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SanphamsModule { }
