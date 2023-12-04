import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseApiUrl } from "./general";

const routes: Routes = [
  { path: '',   redirectTo: `/${BaseApiUrl.BaoCaos}`, pathMatch: 'full' }, // redirect to ,
  {
    path: BaseApiUrl.Orders,
    loadChildren: () =>
      import("./Pages/orders/orders.module").then((m) => m.OrdersModule),
  },
  {
    path: BaseApiUrl.BaoCaos,
    loadChildren: () =>
      import("./Pages/reports/reports.module").then((m) => m.ReportsModule),
  },
  {
    path: BaseApiUrl.KhachHangs,
    loadChildren: () =>
      import("./Pages/customers/customers.module").then(
        (m) => m.CustomersModule
      ),
  },
  { path: BaseApiUrl.SanpPhams, loadChildren: () => import('./Pages/products/products.module').then(m => m.ProductsModule) },
  { path: BaseApiUrl.ChiPhis, loadChildren: () => import('./Pages/expense/expense.module').then(m => m.ExpenseModule) },
  { path: 'importGoods', loadChildren: () => import('./Pages/import-goods/import-goods.module').then(m => m.ImportGoodsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation:'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
