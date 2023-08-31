import { NgModule } from "@angular/core";
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



@NgModule({
  declarations: [AppComponent, MenuLeftComponent, MenuLeftComponent, DialogCustomerComponent],
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
    MatDialogModule
  ],
  providers: [IpcService],
  bootstrap: [AppComponent],
})
export class AppModule {}
