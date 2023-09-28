import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongnosComponent } from './congnos.component';

const routes: Routes = [{ path: '', component: CongnosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CongnosRoutingModule { }
