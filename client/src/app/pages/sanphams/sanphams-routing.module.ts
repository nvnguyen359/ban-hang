import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanphamsComponent } from './sanphams.component';

const routes: Routes = [{ path: '', component: SanphamsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanphamsRoutingModule { }
