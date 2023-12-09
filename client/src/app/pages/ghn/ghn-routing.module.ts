import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhnComponent } from './ghn.component';

const routes: Routes = [{ path: '', component: GhnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GhnRoutingModule { }
