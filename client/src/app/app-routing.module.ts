import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', loadChildren: () => import('./pages/nhaphang/nhaphang.module').then(m => m.NhaphangModule) }, 
   { path: 'customers', loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersModule) }, 
   { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule) },
  { path: 'nhaphang', loadChildren: () => import('./pages/nhaphang/nhaphang.module').then(m => m.NhaphangModule) },
  { path: 'sanpham', loadChildren: () => import('./pages/sanphams/sanphams.module').then(m => m.SanphamsModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }