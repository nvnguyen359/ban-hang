import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DataService } from "src/app/services/data.service";
import { BaseApiUrl, Status, delay } from "src/app/general";
import { DonHang } from "src/app/Models/donHang";
import { SelectionModel } from "@angular/cdk/collections";
import { ChiTietDonHang } from "src/app/Models/chiTietDonHang";
import { ApiService } from "src/app/services/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { async } from "@angular/core/testing";

@Component({
  selector: "app-bangmorong",
  templateUrl: "./bangmorong.component.html",
  styleUrls: ["./bangmorong.component.scss"],
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
export class BangmorongComponent {
  @Input() keys = [
    "Khách Hàng",
    "Tên Khách Hàng",
    "Trạng Thái",
    "Tiền Công",
    "Phí Ship",
    "Giảm Giá",
    "Ghi Chú",
    "Ngày Bán",
    "Thành Tiền",
    "Thanh Toán",
    "Nhân Viên",
  ];

  @Input() data: any;
  @Input() allData: any;
  @Input() columnsToDisplay: any = [
    "Id",
    "Tên Khách Hàng",
    "Trạng Thái",
    "Số Lượng",
    "Thành Tiền",
    "Chiết Khấu",
    "Tiền Công",
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
  dataSource?: any;
  addData?: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  constructor(
    private dataService: DataService,
    private changeDetectorRefs: ChangeDetectorRef,
    private service: ApiService,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit() {
    this.onLoadData();
    this.dataService.currentMessage.subscribe((e: any) => {
      if (e.status == Status.Refesh) {
       this.service.get(BaseApiUrl.All).then((data:any)=>{
        this.dataSource.data = data['orders'].reverse();
        this.changeDetectorRefs.detectChanges();
       })
      }
    });
  }

  onGetAllDonHangs(donhangs?: any, chitiets?: any) {
    let donhangx = Array.from(donhangs as any[]).map((x: any) => {
      x["Ngày Bán"] = `${x["Ngày Bán"]}`.DateFormatDDMMYYY();
      return x;
    });
    chitiets = chitiets as any[];

    donhangs = Array.from(donhangx).map((x: any) => {
      x["chitiets"] = chitiets
        .map((x: any) => {
          if (x["Ngày"]) x["Ngày"] = `${x["Ngày"]}`.DateFormatDDMMYYY();
          return x;
        })
        .filter((a: any) => a["Đơn Hàng"] == x["Id"]);
      // x['Tên Khách Hàng'] =` <button mat-button color="primary">${x['Tên Khách Hàng']}</button>`;
      return x;
    });
    console.log(donhangs);
    this.dataSource = new MatTableDataSource(Array.from(donhangs).reverse());
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
    this.dataSource.paginator = this.paginator;
    // this.changeDetectorRefs.detectChanges();
  }


  
 
  classToday(value: any) {
    // console.log(value)
    const today = new Date();
    // console.log(current.toLocaleDateString(),today.toLocaleDateString(),current.toLocaleDateString()==today.toLocaleDateString())
    const result = value == today.toLocaleDateString() ? "tr-today" : "fal";
    return result;
  }

  onLoadData() {
    console.log(this.data);
    this.dataSource = new MatTableDataSource(Array.from(this.data).reverse());
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  IsNumber(value: any): string {
    value = `${value}`.replaceAll(".", "");
    try {
      return Number.isInteger(parseInt(value)) ? "text-right" : "text-left";
    } catch (error) {
      return "";
    }
  }
  onClickButton(item: any, event: Event) {
    this.eventClickButton.emit(item);
    event.stopPropagation();
  }
  OnPrint(el: any, event: Event) {
    this.onPrint.emit(el);
    event.stopPropagation();
  }
  async onPrints(event: Event) {
    //console.log(this.selection.selected);
    const array = this.selection.selected;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      this.onPrint.emit(element);
      await delay(2000);
    }
    event.stopPropagation();
  }
  OnEvent(item: any, ev: any) {
    console.log({ donhang: item, onUpdate: ev });
    //  this.refesh(item,ev)
    this.eventDeleteOrUpdate.emit({ donhang: item, onUpdate: ev });
  }
  onCapNhat(item: any, ev: any) {
    this.eventDeleteOrUpdate.emit({ donhang: item, onUpdate: ev });
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
