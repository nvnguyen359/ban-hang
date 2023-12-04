import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductUpsertComponent } from './product-upsert/product-upsert.component';
import { ExpansionTableComponent } from 'src/app/Components/expansion-table/expansion-table.component';
import { ColumnOrdersPipe } from 'src/app/Pipes/column-orders.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductUpsertComponent,
 
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ExpansionTableComponent,MatIconModule,MatButtonModule

  ]
})
export class ProductsModule { }
