import { NgModule } from "@angular/core";
import { CommonModule, NgFor, NgIf, formatNumber } from "@angular/common";

import { BangmorongRoutingModule } from "./bangmorong-routing.module";
import { BangmorongComponent } from "./bangmorong.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { FormmatNumberPipeX } from "src/app/pipes/formmat-number.pipe";




@NgModule({
  declarations: [BangmorongComponent,FormmatNumberPipeX],
  imports: [
    CommonModule,
    BangmorongRoutingModule,
    MatTableModule,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
  ],

  exports: [BangmorongComponent],
})
export class BangmorongModule {}
