import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BangmorongComponent } from './bangmorong.component';

const routes: Routes = [{ path: '', component: BangmorongComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BangmorongRoutingModule { }
