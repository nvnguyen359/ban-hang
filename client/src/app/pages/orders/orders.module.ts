import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";
import { CommonModule, NgFor, NgIf } from "@angular/common";

import { OrdersRoutingModule } from "./orders-routing.module";
import { OrdersComponent } from "./orders.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { OrderUpsertComponent } from "./order-upsert/order-upsert.component";
import { MatTabsModule } from "@angular/material/tabs";
import { OrderGridComponent } from "src/app/Components/order-grid/order-grid.component";
import { OrderListViewComponent } from "src/app/Components/order-list-view/order-list-view.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule, SortDirection } from "@angular/material/sort";
import { ColumnOrdersPipe } from "src/app/Pipes/column-orders.pipe";
import { FormatValuePipe } from "src/app/Pipes/format-value.pipe";
import { StatusComponent } from "src/app/Components/status/status.component";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AutocompleteComponent } from "src/app/Components/autocomplete/autocomplete.component";
import { InforCustomerInOrderComponent } from "src/app/Components/infor-customer-in-order/infor-customer-in-order.component";
@NgModule({
  declarations: [
    OrdersComponent,
    OrderUpsertComponent,
    OrderGridComponent,
    OrderListViewComponent,
    ColumnOrdersPipe,
    FormatValuePipe,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatTableModule,
    MatTabsModule,
    AutocompleteComponent,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatRippleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    MatAutocompleteModule,
    StatusComponent,
    InforCustomerInOrderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class OrdersModule {}
