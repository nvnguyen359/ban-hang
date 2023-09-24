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
import { Status, delay } from "src/app/general";
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
  @Input() allData:any;
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
  ) {

  }
  ngOnInit() {
    this.onLoadData();
    
  }
  async mapdonHangs() {
    return new Promise(async (res, rej) => {
      let data: any = [];
      let donhangs = (await this.service.get("donhang")) as any;
      //   console.log(donhangs)
      const chitiets = (await this.service.get("chitietdonhang")) as any;
     
      for (let i = 0; i < donhangs.length; i++) {
        const donhang = donhangs[i];
        donhang["Ngày Bán"] = `${donhang["Ngày Bán"]}`.DateFormatDDMMYYY();
        const chitiet = chitiets.filter(
          (x: any) => x["Đơn Hàng"] == donhang["Id"]
        );
        donhang["chitiets"] = chitiet.map((x: any) => {
          x["Ngày"] = `${"Ngày"}`.DateFormatDDMMYYY();
          return x;
        });
        data.push(donhang);
      }
      res(data);
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
    this.dataSource = donhangs
      ? new MatTableDataSource(ELEMENT_DATA)
      : new MatTableDataSource(Array.from(donhangs).reverse());
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
    this.dataSource.paginator = this.paginator;
    // this.changeDetectorRefs.detectChanges();
  }

  refesh(item: any, status: string) {
    switch (status) {
      case "capnhat":
        {
          this.dataSource.data = Array.from(this.dataSource.data).map(
            (x: any) => {
              return x["Id"] == item["Id"] ? item : x;
            }
          );
        }
        break;

      case "xoa":
        {
          this.dataSource.data = Array.from(this.dataSource.data).filter(
            (x: any) => x["Id"] != item["Id"]
          );
        }
        break;
    }
    this.changeDetectorRefs.detectChanges();
  }
  refeshTable(item: DonHang) {
    this.mapdonHangs().then((data: any) => {
      this.dataSource.data = data.reverse();
      this.changeDetectorRefs.detectChanges();
    });
  }
  classToday(value: any) {
    // console.log(value)
    const today = new Date();
    // console.log(current.toLocaleDateString(),today.toLocaleDateString(),current.toLocaleDateString()==today.toLocaleDateString())
    const result = value == today.toLocaleDateString() ? "tr-today" : "fal";
    return result;
  }

  onLoadData() {
    console.log(this.data)
    this.dataSource = !this.data
      ? new MatTableDataSource(ELEMENT_DATA)
      : new MatTableDataSource(Array.from(this.data).reverse());
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
  checkboxLabel(row?: PeriodicElement): string {
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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}
const ELEMENT_DATA = [
  {
    position: 1,
    name: "Hydrogen",
    weight: 1.0079,
    symbol: "H",
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  },
  {
    position: 2,
    name: "Helium",
    weight: 4.0026,
    symbol: "He",
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
  },
  {
    position: 3,
    name: "Lithium",
    weight: 6.941,
    symbol: "Li",
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
  },
  {
    position: 4,
    name: "Beryllium",
    weight: 9.0122,
    symbol: "Be",
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
  },
  {
    position: 5,
    name: "Boron",
    weight: 10.811,
    symbol: "B",
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
  },
  {
    position: 6,
    name: "Carbon",
    weight: 12.0107,
    symbol: "C",
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`,
  },
  {
    position: 7,
    name: "Nitrogen",
    weight: 14.0067,
    symbol: "N",
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
  },
  {
    position: 8,
    name: "Oxygen",
    weight: 15.9994,
    symbol: "O",
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`,
  },
  {
    position: 9,
    name: "Fluorine",
    weight: 18.9984,
    symbol: "F",
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`,
  },
  {
    position: 10,
    name: "Neon",
    weight: 20.1797,
    symbol: "Ne",
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`,
  },
];
