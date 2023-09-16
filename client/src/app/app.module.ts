import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IpcService } from "src/ipc.service";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule } from "@angular/material/sidenav";
import {
  NgIf,
  NgFor,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { MatListModule } from "@angular/material/list";
import { MenuLeftComponent } from "./components/menu-left/menu-left.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DialogCustomerComponent } from "./components/dialog-customer/dialog-customer.component";

import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DialogConfirmComponent } from "./components/dialog-confirm/dialog-confirm.component";
import { OnNhapHangComponent } from "./components/on-nhap-hang/on-nhap-hang.component";
import { ProductComponent } from "./components/product/product.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { OrderComponent } from "./components/order/order.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AutocompleteComponent } from "./components/autocomplete/autocomplete.component";
import { ShowTextPipe } from "./pipes/show-text.pipe";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatRippleModule,
} from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { PrintOrderComponent } from "./components/print-order/print-order.component";
import { DialogAlertComponent } from "./components/dialog-alert/dialog-alert.component";
import { ClassTodayPipe } from "./pipes/class-today.pipe";
import { ProductArrayComponent } from "./components/product-array/product-array.component";
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoadingInterceptor } from "./interceptor/loading.interceptor";
import { ExamFormArrayComponent } from './components/exam-form-array/exam-form-array.component';
import { StatusOrderComponent } from './components/status-order/status-order.component';
import { MatCheckboxModule } from "@angular/material/checkbox";


const MY_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY", // this is how your date will be parsed from Input
  },
  display: {
    dateInput: "DD/MM/YYYY", // this is how your date will get displayed on the Input
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
  MAT_DATE_LOCALE:'vi-VN'
};
const config: SocketIoConfig = { url: "http://localhost:18092", options: {} };
@NgModule({
  declarations: [
    AppComponent,
    MenuLeftComponent,
    MenuLeftComponent,
    DialogCustomerComponent,
    DialogConfirmComponent,
    OnNhapHangComponent,
    ProductComponent,
    OrderComponent,
    AutocompleteComponent,
    ShowTextPipe,
    PrintOrderComponent,
    DialogAlertComponent,
    ProductArrayComponent,
    SpinnerComponent,
    ExamFormArrayComponent,
    StatusOrderComponent,
  ],
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
    MatRippleModule,
    MatCardModule,
    MatButtonToggleModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatCheckboxModule
  ],
  providers: [
    // { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },

     
    // {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    // {provide:MAT_DATE_LOCALE,useValue:'vi'}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
