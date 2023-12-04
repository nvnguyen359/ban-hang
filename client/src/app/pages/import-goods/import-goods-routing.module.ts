import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportGoodsComponent } from './import-goods.component';

const routes: Routes = [{ path: '', component: ImportGoodsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportGoodsRoutingModule { }
