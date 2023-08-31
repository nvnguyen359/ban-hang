import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhaphangComponent } from './nhaphang.component';

const routes: Routes = [{ path: '', component: NhaphangComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhaphangRoutingModule { }
