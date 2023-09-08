import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonhangsComponent } from './donhangs.component';

import { BangmorongComponent } from 'src/app/components/bangmorong/bangmorong.component';

const routes: Routes = [{ path: '', component: DonhangsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonhangsRoutingModule { }
