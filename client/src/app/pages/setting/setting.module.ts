import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { PrintersComponent } from 'src/app/Components/printers/printers.component';


@NgModule({
  declarations: [
    SettingComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    PrintersComponent
  ]
})
export class SettingModule { }
