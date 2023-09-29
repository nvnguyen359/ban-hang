import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { KhachHang } from "src/app/Models/khachHangs";
import { SanPham } from "src/app/Models/sanPham";
import { BaseApiUrl } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { ListSanPhamComponent } from "./list-san-pham/list-san-pham.component";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-sanphams",
  templateUrl: "./sanphams.component.html",
  styleUrls: ["./sanphams.component.scss"],
})
export class SanphamsComponent {
  @ViewChild(MatTable) table: MatTable<SanPham> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns = ["Index", "Name", "Đơn Vị Tính", "Giá Nhập", "Giá Bán"];
  selection = new SelectionModel<any>(true, []);
  constructor(
    private service: ApiService,
    private router: Router,
    private readonly dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}
  dataSource?: any;
  sanphams: any;
  async ngOnInit() {
    console.log(this.router.url);
    this.getSanphams();
  }

  getSanphams() {
    console.log("====================");
    this.service.get(BaseApiUrl.SanpPhams).then((e) => {
      const sanphams = (e as SanPham[]).reverse().map((x: SanPham, index) => {
        x.Index = index + 1;
        return x;
      });

      this.dataSource = new MatTableDataSource<any>(sanphams);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function (
        record: SanPham,
        filter: string
      ) {
        return record["Name"]
          .removeAccents()
          .toLowerCase()
          .includes(filter.removeAccents().toLowerCase());
      };

      this.changeDetectorRefs.detectChanges();
    });
  }
  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onClickRow(row: any) {
    //  console.log(row)
    this.onDialog(row);
  }
  onDialog(row?: SanPham) {
    const dia = this.dialog.open(ListSanPhamComponent, {
      data: { row, sanphams: this.dataSource.data },
    });
    dia.afterClosed().subscribe((result: any) => {
      console.log('loading...')
      setTimeout(() => {
        this.refesh();
      }, 1100);
    });
  }
  refesh() {
    this.service.get(BaseApiUrl.SanpPhams).then((e: any) => {
      this.updateSanPhams(e);
    });
  }
  updateSanPhams(e: any) {
    if (Array.from(e)) {
      const sanphams = (e as SanPham[]).reverse().map((x: SanPham, index) => {
        x.Index = index + 1;
        return x;
      });
      this.dataSource.data = sanphams;
    } else {
      this.dataSource.data = (this.dataSource.data as SanPham[]).map(
        (x: SanPham) => {
          return x["Id"] == e["Id"] ? e : x;
        }
      );
    }
    this.changeDetectorRefs.detectChanges();
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  onSelect(){
    console.log(this.selection.selected)
    const dia = this.dialog.open(ListSanPhamComponent, {
      data: { row:this.selection.selected, sanphams: this.dataSource.data },
    });
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
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  createIndex(index:number){
    const init ='000';
    const charNum = `${index}`.length;
    return `${init.slice(charNum)}${index}`
  }
}
