import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { DonHang } from "src/app/Models/donHang";
import { BaseApiUrl } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { addRxPlugin, createRxDatabase } from "rxdb";
import { isDevMode } from "@angular/core";
/**
 * For browsers, we use the dexie.js based storage
 * which stores data in IndexedDB in the browser.
 * In other JavaScript runtimes, we can use different storages:
 * @link https://rxdb.info/rx-storage.html
 */
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
addRxPlugin(RxDBDevModePlugin);
@Component({
  selector: "app-list-orders",
  templateUrl: "./list-orders.component.html",
  styleUrls: ["./list-orders.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ListOrdersComponent {
  @Input() columnsToDisplay: any = [
    "Id",
    "Tên Khách Hàng",
    "Trạng Thái",
    "Số Lượng",
    "Thành Tiền",
    "Chiết Khấu",
    "Thanh Toán",
    "Ngày Bán",
  ];
  @Input() hideColumns?: string;
  @Input() options?: any;
  @Output() eventClickButton = new EventEmitter();
  @Output() onPrint = new EventEmitter();
  @Output() eventDeleteOrUpdate = new EventEmitter();
  columnsToDisplayWithExpand: any;
  expandedElement?: any | null;
  columnsChild?: any = [
    "Tên Sản Phẩm",
    "Số Lượng",
    "Đơn Vị Tính",
    "Đơn giá",
    "Thành Tiền",
    "Ngày",
    "Đơn Hàng",
  ];
  donhangs: DonHang[] = [];
  dataSource?: any;
  addData?: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private service: ApiService,
    private snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    // create a database
    // this.getDonHangs();
    await this.createDb();
  }
  async createDb() {
    const mySchema = {
      version: 0,
      primaryKey: "id",
      type: "object",
      properties: {
        id: {
          type: "string",
          maxLength: 100, // <- the primary key must have set maxLength
        },
        name: {
          type: "string",
        },
        done: {
          type: "boolean",
        },
        timestamp: {
          type: "date-time",
        },
      },
      required: ["id", "name", "done", "timestamp"],
    };
    const myDatabase = await createRxDatabase({
      name: "mydatabase",
      storage: getRxStorageDexie(),
    });
    await myDatabase.addCollections({
      todos: {
        schema: mySchema,
      },
    });

    // const myDocument = await myDatabase.collections["todos"].insert({
    //   id: "todo1",
    //   name: "Learn RxDB",
    //   done: false,
    //   timestamp: new Date().toISOString(),
    // });
    const observable = myDatabase.collections["todos"].find({
      selector: {
          done: {
              $eq: false
          }
      }
  }).exec();
  console.log(await observable)
  // observable.subscribe(allNonDoneTodos => {
  //   console.log(allNonDoneTodos)
  //     console.log('Currently have ' + allNonDoneTodos.length + 'things to do');
  // });
  }

  getDonHangs() {
    console.time("time");
    this.service.get(BaseApiUrl.Orders).then((result: any) => {
      console.log(result);
      this.donhangs = result;
      this.dataSource = new MatTableDataSource(
        Array.from(this.donhangs).reverse()
      );
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
      this.dataSource.paginator = this.paginator;
      console.timeEnd("time");
    });
  }
  //#region  event
  onPrints(event: any) {}
  OnPrint(element: any, event: any) {}
  onClickButton(element: any, event: any) {}
  onCapNhat(element: any, event: any) {}
  onDelete(element: any) {}
  //#endregion
  IsNumber(value: any): string {
    value = `${value}`.replaceAll(".", "");
    try {
      return Number.isInteger(parseInt(value)) ? "text-right" : "text-left";
    } catch (error) {
      return "";
    }
  }
  classToday(value: any) {
    // console.log(value)
    const today = new Date();
    // console.log(current.toLocaleDateString(),today.toLocaleDateString(),current.toLocaleDateString()==today.toLocaleDateString())
    const result = value == today.toLocaleDateString() ? "tr-today" : "fal";
    return result;
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

  async onSelectStatus(event: any, element: any) {
    element["Trạng Thái"] = event.value;
    console.log(element);
    await this.service.put("donhang", element);
    this.snackbar.open("Cập Nhật Thành Công");
  }
  onStop(event: any) {
    event?.stopPropagation();
  }
}
export class heroes {}
