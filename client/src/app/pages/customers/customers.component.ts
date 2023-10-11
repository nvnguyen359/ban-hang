import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from "@angular/material/table";
import { KhachHang } from "src/app/Models/khachHangs";
import { ApiService } from "src/app/services/api.service";
import "./../../lib.extensions";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { DialogCustomerComponent } from "src/app/components/dialog-customer/dialog-customer.component";
import { BaseApiUrl } from "src/app/general";
import { SocketService } from "src/app/services/socket.service";
import { OrdersComponent } from "src/app/components/orders/orders.component";
@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements AfterViewInit {
  dataSource: any;
  displayedColumns: string[] = ["Index", "Tên Khách Hàng", "Phone", "Địa Chỉ"];
  url = "khachhang";
  @ViewChild(MatTable) table: MatTable<KhachHang> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private api: ApiService,
    private readonly dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private socket: SocketService
  ) {
    //this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.getData();
    // this.getAllDonHangs();
  }
  getData() {
    console.log("====================");
    this.api.get(BaseApiUrl.KhachHangs).then((e) => {
      const khachhangs = (e as KhachHang[])
        .reverse()
        .map((x: KhachHang, index) => {
          x.Index = index + 1;
          return x;
        });

      this.dataSource = new MatTableDataSource<KhachHang>(khachhangs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function (
        record: KhachHang,
        filter: string
      ) {
        return record["Tên Khách Hàng"]
          .removeAccents()
          .toLowerCase()
          .includes(filter.removeAccents().toLowerCase());
      };

      this.changeDetectorRefs.detectChanges();
    });
  }

  ngAfterViewInit() {}
  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onDialogDh(khachhang: KhachHang) {
   // console.log(khachhang)
    let all = JSON.parse(`${localStorage.getItem("all")}`);
    const khachhangs = (all["khachhangs"] as KhachHang[]).map((x: any) => {
      if (x["Id"] == khachhang["Id"]) x["selected"] = true;
      return x;
    });
    all["khachhangs"] = khachhangs;
    const dialogRef = this.dialog.open(OrdersComponent, { data: all });
    dialogRef.afterClosed().subscribe((d: any) => {});
  }
  onDialog(row?: KhachHang) {
    console.log(row);
    const dia = this.dialog.open(DialogCustomerComponent, { data: row });
    dia.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.refeshTable();
      }
    });
  }
  refeshTable() {
    this.api.get(BaseApiUrl.KhachHangs).then((e) => {
      const all = JSON.parse(`${localStorage.getItem("all")}`);
      all["khachhangs"] = e;
      localStorage.setItem("all", JSON.stringify(all));
      const khachhangs = (e as KhachHang[])
        .reverse()
        .map((x: KhachHang, index) => {
          x.Index = index + 1;
          return x;
        });
      console.log("refeshtable", khachhangs.length);
      this.dataSource.data = khachhangs;
    });
  }
  showDelete(btn: any) {
    console.log(btn);
    const btnDeletes = document.querySelectorAll(".btnDelete");
    if (btnDeletes) {
      Array.from(btnDeletes).forEach((btnDelete: Element, index) => {
        btnDelete.classList.remove("show");
        if (index == btn - 1) {
          btnDelete.classList.add("show");
        }
      });
    }
  }
  onDelete(id: any) {
    if (!id) return;
    this.api.destroy(this.url, id).then((e: any) => {
      console.log("delete", e);
      setTimeout(() => {
        // document.getElementById('refeshTable')?.click()
        this.refeshTable();
      }, 500);
    });
  }
}
