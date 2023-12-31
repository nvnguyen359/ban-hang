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
  { path:BaseApiUrl.ImportGoods, loadChildren: () => import('./Pages/import-goods/import-goods.module').then(m => m.ImportGoodsModule) },
  { path: BaseApiUrl.Setting, loadChildren: () => import('./Pages/setting/setting.module').then(m => m.SettingModule) },
  { path: 'debt', loadChildren: () => import('./Pages/debt/debt.module').then(m => m.DebtModule) },
  { path: 'ghn', loadChildren: () => import('./Pages/ghn/ghn.module').then(m => m.GhnModule) },
  { path: 'inventory', loadChildren: () => import('./Pages/inventory/inventory.module').then(m => m.InventoryModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
