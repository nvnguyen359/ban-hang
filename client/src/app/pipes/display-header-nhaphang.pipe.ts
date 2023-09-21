import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "displayHeaderNhaphang",
})
export class DisplayHeaderNhaphangPipe implements PipeTransform {
  transform(key: any): any {
    const columnsToDisplay: any = {
      date: "Ngày Nhập",
      count: "Số Lượng",
      tong: "Thanh Toán",
      thanhtoan: "Tiền Hàng",
      quantity:'Tổng Sản Phẩm'
    };
    return columnsToDisplay[key];
  }
}
