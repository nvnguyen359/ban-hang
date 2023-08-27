import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [ { path: 'customers', loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersModule) }, { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
