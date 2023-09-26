import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseApiUrl } from "./general";

const routes: Routes = [
  // { path: '', loadChildren: () => import('./pages/nhaphang/nhaphang.module').then(m => m.NhaphangModule) },
  {
    path: BaseApiUrl.KhachHangs,
    loadChildren: () =>
      import("./pages/customers/customers.module").then(
        (m) => m.CustomersModule
      ),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./pages/settings/settings.module").then((m) => m.SettingsModule),
  },
  {
    path: BaseApiUrl.NhapHangs,
    loadChildren: () =>
      import("./pages/nhaphang/nhaphang.module").then((m) => m.NhaphangModule),
  },
  {
    path: BaseApiUrl.SanpPhams,
    loadChildren: () =>
      import("./pages/sanphams/sanphams.module").then((m) => m.SanphamsModule),
  },
  {
    path: BaseApiUrl.DonHangs,
    loadChildren: () =>
      import("./pages/donhangs/donhangs.module").then((m) => m.DonhangsModule),
  },
  {
    path: BaseApiUrl.ChiPhis,
    loadChildren: () =>
      import("./pages/chiphis/chiphis.module").then((m) => m.ChiphisModule),
  },
  { path:BaseApiUrl.CongNos, loadChildren: () => import('./pages/congnos/congnos.module').then(m => m.CongnosModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  providers: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
