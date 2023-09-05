import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IpcService } from "src/ipc.service";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule } from "@angular/material/sidenav";
import { NgIf, NgFor } from "@angular/common";
import { CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { MatListModule } from "@angular/material/list";
import { MenuLeftComponent } from "./components/menu-left/menu-left.component";
import { ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule } from "@angular/common/http";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DialogCustomerComponent } from './components/dialog-customer/dialog-customer.component';

import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { OnNhapHangComponent } from './components/on-nhap-hang/on-nhap-hang.component';
import { ProductComponent } from './components/product/product.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { OrderComponent } from './components/order/order.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { ShowTextPipe } from './pipes/show-text.pipe';
import { MatRippleModule } from "@angular/material/core";
const config: SocketIoConfig = { url: 'http://localhost:18092', options: {} };
@NgModule({
  declarations: [AppComponent, MenuLeftComponent, MenuLeftComponent, DialogCustomerComponent, DialogConfirmComponent, OnNhapHangComponent, ProductComponent, OrderComponent, AutocompleteComponent, ShowTextPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    NgIf,
    NgFor,
    CdkMenu,
    CdkMenuItem,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SocketIoModule.forRoot(config),
    MatAutocompleteModule,
    MatRippleModule
  ],
  providers: [IpcService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
