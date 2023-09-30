import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaocaoComponent } from './baocao.component';

const routes: Routes = [{ path: '', component: BaocaoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaocaoRoutingModule { }
