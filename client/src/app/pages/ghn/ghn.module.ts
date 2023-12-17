import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GhnRoutingModule } from "./ghn-routing.module";
import { GhnComponent } from "./ghn.component";
import { StackedColumnsComponent } from "src/app/Charts/stacked-columns/stacked-columns.component";

@NgModule({
  declarations: [GhnComponent],
  imports: [CommonModule, GhnRoutingModule, StackedColumnsComponent],
})
export class GhnModule {}
