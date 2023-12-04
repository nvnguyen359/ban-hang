import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OrderUpsertComponent } from "./order-upsert/order-upsert.component";
import { ApiService } from "src/app/services/api.service";
import { BaseApiUrl, delay, getLocalStorage } from "src/app/general";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { DataService } from "src/app/services/data.service";
import { SelectionModel } from "@angular/cdk/collections";
import { PrintHtmlService } from "src/app/services/print-html.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { async } from "rxjs";
@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed,void", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class OrdersComponent {
  cusomers: any;
  products: any;
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  pageSize = 10;
  pageEvent?: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  columnsToDisplay: string[] = [
    "no",
    "name",
    "status",
    "wage",
    "discount",
    // "shippingFee",
    "quantity",
    "intoMney",
    "pay",
    "createdAt",
  ];
  columnsChild?: any = [
    { key: "no", value: "#" },
    { key: "name", value: "Tên Sản Phẩm" },
    { key: "quantity", value: "Số Lượng" },
    { key: "price", value: "Đơn Giá" },
    { key: "intoMoney", value: "Thành Tiền" },
    { key: "createdAt", value: "Ngày" },
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
  expandedElement: any | null;
  details: any = [];
  getCustomer: any;
  constructor(
    private dialog: MatDialog,
    private service: ApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
    private printHtmt: PrintHtmlService,
    private snckbar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {}
  async ngOnInit() {
    this.getOrders();
    await this.getCustomers();
    await this.getProduct();
  }
  ngAfterViewInit() {
    this.dataService.currentMessage.subscribe(async (data: any) => {
      if (data?.delDetails) {
        this.service
          .destroy(BaseApiUrl.ChiTietDonHangs, data.delDetails)
          .then((data: any) => {
            this.getOrders();
          });
      }
      if (data?.saveOrPrint) {
        const order = data.saveOrPrint.order;
        order.details = data.saveOrPrint.details;
        await this.startPrinter(order);
      }
    });
    this.activatedRoute.params.subscribe(async (obj: any) => {
      if (!obj.name) return;
      await this.getCustomers();
      await this.getProduct();
      const ob = { name: obj.name, customerId: obj.id, status: "Đặt Hàng" };
      await this.onCreate(ob);
    });
  }
  openDialog(obj: any = null) {
    console.log(obj)
    return new Promise((res: any, rej) => {
      this.products = this.products.map((x: any) => {
        x.quantity = 0;
        return x;
      });
      const dialogRef = this.dialog.open(OrderUpsertComponent, {
        data: { customers: this.cusomers, products: this.products, order: obj },
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        res(result);
      });
    });
  }
  onTrClick(item: any) {
    // console.log(item);
  }
  getOrders() {
    console.time("order");
    const pageIndex = this.pageEvent?.pageIndex || 0;
    const pageSize = this.pageEvent?.pageSize || 10;
    this.service
      .get(BaseApiUrl.Orders, { page: pageIndex, pageSize })
      .then((data: any) => {
        // this.details = data.items[0].details;
        const items = Array.from(data.items).map((x: any, index: any) => {
          x.no = index + 1 + pageIndex * pageSize;
          const details = Array.from(x.details).map((a: any, index: number) => {
            a.no = index + 1;
            return a;
          });
          x.details = details;
          return x;
        });
        this.resultsLength = data.count;
        this.dataSource.data = items;
        this.changeDetectorRefs.detectChanges();
        // this.dataSource.paginator = this.paginator;
        console.timeEnd("order");
      });
  }
  async getCustomers() {
    this.cusomers = (
      (await this.service.get(BaseApiUrl.KhachHangs, {
        columns: "*",
      })) as any
    ).items;
  }
  async getProduct() {
    this.products = (
      (await this.service.get(BaseApiUrl.SanpPhams, {
        page: 0,
        pageSize: 10000,
      })) as any
    ).items;
  }
  public getServerData(event?: PageEvent) {
    this.pageEvent = event;
    this.getOrders();
  }
  async onOpenDiaLogUpdate(element: any) {
    this.details = element.details;
    const { order, details } = (await this.openDialog(element)) as any;
    if (order) {
      const details1 = Array.from(details).map((x: any) => {
        if (x.no) delete x.no;
        return x;
      });
      // console.log(details1)
      await this.updateOrCreateDetails(details1, order.id);
      // console.log(order)
      try {
        delete order.details;
      } catch (error) {}
      await this.updateOrder(order);
      this.getOrders();
    }
  }
  async updateOrCreateDetails(orderDetailsAfterUpdate: any[], orderId: any) {
    const ids = this.details.map((x: any) => parseInt(x.id)) as any[];
    console.log(ids)
    const url = BaseApiUrl.ChiTietDonHangs;
    const oldDetails = orderDetailsAfterUpdate.filter((x: any) =>
      ids.includes(x.id)
    );
    const newDetails = orderDetailsAfterUpdate.filter(
      (x: any) => !ids.includes(x.id)
    );
    // console.log(oldDetails, newDetails);
    if (oldDetails) {
      for (let index = 0; index < oldDetails.length; index++) {
        const element = oldDetails[index];
        await this.service.update(url, element);
        await delay(100);
      }
    }
    if (newDetails.length > 0) await this.service.create(url, newDetails);
  }
  async onCreate(obj: any = null) {
    const { order, details } = (await this.openDialog(obj)) as any;
    const orderId = (await this.service.create(BaseApiUrl.Order, order)) as any;
    await delay(200);
    let details1 = details.map((x: any) => {
      x.orderId = orderId?.result[0].id;
      return x;
    });
    await this.service.create(BaseApiUrl.ChiTietDonHangs, details1);
    this.getOrders();
  }
  async onDelete(element: any) {
    await this.service.destroy(BaseApiUrl.Order, element.id);
    const details = element["details"];
    if (details?.length > 0) {
      await this.service.destroy(BaseApiUrl.ChiTietDonHangs, details, false);
    }
    this.getOrders();
  }
  async onPrinters() {
    const array = this.selection.selected;
    const cusomers = this.cusomers;
    for (let index = 0; index < array.length; index++) {
      const order = array[index];
      const cusomer = Array.from(cusomers).find(
        (x: any) => order.customerId == x.id
      );
      await this.startPrinter(order, cusomer);
      await delay(200);
    }
  }
  async startPrinter(order: any, cusomer: any = null) {
    const cusomerx = !cusomer
      ? await this.service.getId(BaseApiUrl.KhachHangs, order.customerId)
      : cusomer;
    const local = getLocalStorage();
    order.text = order.pay.convertMoneyIntoWords();
    order.customer = cusomerx;
    this.printHtmt.order = order;
    this.printHtmt.pageSize = !local.page.value ? "80mm" : local.page.value;
    if (local.isThermal == true) {
      const rawHtml = this.printHtmt.rawHtml();
      order.pageName = local.printer.name;
      order.pageSize = local.page.pageSize;
      order.rawHtml = rawHtml;
      order.isPreview = local.isPreview;
      this.service
        .postPrinters(order)
        .then((result: any) => {
          if (result.error) {
            // console.log(result.error,result.text)
            this.service.translate(result.text).then((data: any) => {
              this.snckbar.open(data, "", { duration: 13000 });
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else {
      this.printHtmt.printBill();
    }
  }
  async onPrinter(order: any, event: Event) {
    await this.startPrinter(order);
    event.stopPropagation();
  }
  onSelectStatus(event: any, element: any) {
    let item = element;
    item.status = event.value;
    const details = item["details"];
    delete item["details"];
    delete item["no"];
    this.updateOrder(item);
    this.getOrders();
  }
  async updateOrder(item: any) {
    item.createdAt = new Date(item.createdAt);
    item.updatedAt = new Date();
    const result = await this.service.update(BaseApiUrl.Order, item);
    console.log(result);
  }

  IsNumber(value: any): string {
    value = `${value}`.replaceAll(".", "");
    try {
      return Number.isInteger(parseInt(value)) ? "text-right" : "text-left";
    } catch (error) {
      return "";
    }
  }
  selection = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }
  async onDeletesOrder() {
    const orders = this.selection.selected;
    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      const details = order["details"];
      delete order["details"];
      await this.service.destroy(
        BaseApiUrl.Order,
        order.id,
        index == 0 ? true : false
      );

      for (let index1 = 0; index1 < details?.length || 0; index1++) {
        const element = details[index1];
        await delay(20);
        await this.service.destroy(
          BaseApiUrl.ChiTietDonHangs,
          element.id,
          false
        );
      }
      await delay(90);
    }
    await delay(100);
    this.getOrders();
  }
}
