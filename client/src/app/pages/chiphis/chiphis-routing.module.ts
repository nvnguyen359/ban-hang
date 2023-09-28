import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiphisComponent } from './chiphis.component';

const routes: Routes = [{ path: '', component: ChiphisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChiphisRoutingModule { }
