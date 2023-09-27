import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { KhachHang } from "../Models/khachHangs";
import { DonHang } from "../Models/donHang";
import { ChiTietDonHang } from "../Models/chiTietDonHang";
import { BaseApiUrl } from "../general";

@Injectable({
  providedIn: "root",
})
export class ThermalPrinterServiceService {
  printContent = ``; //"80mm" | "58mm"
  cssStyles = ``;
  paperWidth = "148mm";
  array: any;
  constructor(private service: ApiService) {}
  set PaperWidth(width: any) {
    this.paperWidth = width;
  }
  set DataDonHang(data: any) {
    this.array = data;
  }
  get PaperWidth() {
    return this.paperWidth;
  }
  addRawHtml(htmlEl: any) {
    this.printContent += `\n${htmlEl}`;
  }
  addHeader() {
    return ` <head>
    <title>Print</title>
    <style>
    html {
        padding: 0;
        margin: 2px;
        width: ${this.paperWidth};
    }

    body {
        margin: 0;
    }

    body {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .flex {
        display: flex;
    }

    .kh {
        display: block;
        width: 100%;
        margin-top:-55px
    }

    .infor-store {
        margin: 4px;
        margin-top: 8px;
        display: block;
        width: 100%;
    }

    .block {
        display: block;
    }

    .text-center {
        text-align: center;
    }

    .text-right {
        text-align: right;
    }

    .a8 .infor-store {
        text-align: center;
        font-size: 14px;
    }

    .bill-table {
        width: 100%;
        display: block;
        margin-top: 16px;
    }

    table,
    td,
    th {
        border: 1px solid;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    .a5 {
        font-size: 16px;
    }

    .left {
        display: block;
    }

    .qr {
        margin-top: -7px;
    }
</style>
    <script>
      window.onafterprint = event => {
        window.close();
      };
    </script>
  </head>`;
  }
  addInforStore(donhang: DonHang) {
    const addInfo =
      donhang["Id"] +
      "-" +
      donhang["Tên Khách Hàng"] +
      "-" +
      donhang["Ngày Bán"];
    // console.log(`https://img.vietqr.io/image/VCB-0041000171668-compact2.jpg?amount=${donhang["Thanh Toán"]}&amp;accountName=DO%20VAN%20HIEU&addInfo=${addInfo}"`)
    return `<div class="infor-store">
<b class="block text-center">HÓA ĐƠN BÁN HÀNG</b>
<small class="block text-center">${donhang["Ngày Bán"]}</small>
<p></p>
<div class="flex">
<div class="left">
<b class="block">LK PIN HIỆU NGÂN</b>
<div>
    <div>Chuyên: Máy pin - cung cấp linh kiện ngành pin</div>
   <div> Địa chỉ: TDP Hữu Lộc, P.Trúc Lâm, Nghi Sơn, Thanh Hóa</div>
</div>
<b class="block"> ĐT: 0988.114.714 - 0842.399.889</b>
</div>
<div class="qr">
<img id="qrViet" width='150' height='150' src="https://img.vietqr.io/image/VCB-0041000171668-compact2.jpg?amount=${donhang["Thanh Toán"]}&amp;accountName=DO%20VAN%20HIEU&addInfo=${addInfo}"  alt="" style="">
</div>
</div>
</div>`;
  }
  async getKh(id: any, idDh: any) {
    let kh = ((await this.service.getId(BaseApiUrl.KhachHangs, id)) as any)
      .data as any;
    return `<div class="kh">
<div class="block"><b>ID:</b>${idDh}</div>
<div class="block"><b>Khách Hàng:</b>${kh["Tên Khách Hàng"]} (${kh["Phone"]})</div>
<div class="block"><b>Địa Chỉ   :</b>${kh["Địa Chỉ"]}</div>
</div>`;
  }
  setBodyTable(donhang: DonHang, isPageA5: any, columns: string[]) {
    const chitiets = Array.from(donhang["chitiets"]).map((x: any, index) => {
      x["STT"] = index + 1;
      return x;
    });
    let tableBody = "";
console.log(columns)
if(columns.filter((x:any)=>x=='STT').length>1){
  columns.pop();
}
    chitiets.forEach((x: any, index) => {
      if (!isPageA5) {
        delete x["STT"];
        delete x["Đơn Vị Tính"];
      }
      let tr = `<tr>`;
      columns.forEach((column) => {
        const item = !Number.isInteger(parseInt(x[column]))
          ? `<td >${x[column]}</td>`
          : `<td class="text-right">${parseInt(
              x[column]
            ).toLocaleString()}</td>`;
        tr += item;
      });
      tr += `</tr>`;
      tableBody += tr;
    });
    return tableBody;
  }
  setTable(head: any, body: any, foot: any) {
    const tableBill = `
<div class="bill-table">
<table>
    <thead>
${head}
    </thead>
    <tbody>
    ${body}
    </tbody>
    <tfoot>
    ${foot}
    </tfoot>
</table>
<div class="block"><i>(Thanh toán nhanh bằng VietQr ở trên)</i></div>
</div>`;
    return tableBill;
  }
  setHeadTable(columns: any) {
    columns = columns.map((a: any) => {
      if (a == "Đơn Vị Tính") a = "ĐV";
      if (a == "Số Lượng") a = "SL";
      return a;
    });
    if (columns.filter((x: any) => x == "STT").length > 1) {
      columns.pop();
    }
    let thsHtml = "";
    columns.forEach((x: any) => {
      thsHtml += `<th>${x}</th>`;
    });

    return thsHtml;
  }
  setFootTable(donhangs: DonHang, isPageA5: any) {
    const colspan = isPageA5 ? 2 : 1;
    const colspanTong = isPageA5 ? 3 : 2;
    const colspanGiamGia = isPageA5 ? 5 : 3;
    const tong = `<tr>
    <td colspan="${colspan}">Tổng</td>
    <td class="text-right">${donhangs["Số Lượng"]}</td>
    <td class="text-right" colspan="${colspanTong}">${parseInt(
      `${donhangs["Thành Tiền"]}`
    ).toLocaleString()}</td>
    </tr>`;
    const giamgia =
      donhangs["Giảm Giá"] > 0
        ? `
    <tr>
    <td colspan="${colspanGiamGia}">Chiết Khấu</td>
    <td class="text-right" colspan="${colspanTong + 1}">${
            donhangs["Giảm Giá"]
          }</td>
    </tr>
    `
        : "";
    const tientong =
      donhangs["Tiền Công"] > 0
        ? `
    <tr>
    <td colspan="${colspanGiamGia}">Tiền Công</td>
    <td class="text-right" colspan="${colspanTong + 1}">${parseInt(
            donhangs["Tiền Công"] + ""
          ).toLocaleString()}</td>
    </tr>
    `
        : "";
    const phiship =
      donhangs["Phí Ship"] > 0
        ? `
    <tr>
    <td colspan="${colspanGiamGia}">Phí Ship</td>
    <td class="text-right" colspan="${colspanTong + 1}">${parseInt(
            `${donhangs["Phí Ship"]}`
          ).toLocaleString()}</td>
    </tr>
    `
        : "";
    const thanhtoan = `
    <tr>
    <td colspan="${colspanGiamGia}">Thanh Toán</td>
    <td class="text-right" colspan="${colspanTong + 1}"><b>${parseInt(
      donhangs["Thanh Toán"] + ""
    ).toLocaleString("vi")}</b></td>
    </tr>
    `;
    const tfoot = `
    ${tong}
    ${giamgia}
    ${tientong}
    ${phiship}
    ${thanhtoan}
    `;
    return tfoot;
  }
  async print(donhang: any) {
    //console.log(donhang);
    const classMain = this.PaperWidth == "80mm" ? "a8" : "a5";
    const isPageA5 = classMain == "a5";
    console.log(classMain);
    const filter = ["Id", "Sản Phẩm", "Ngày", "Giá Nhập", "Đơn Hàng"];
    const columnsChitiets = Object.keys(donhang["chitiets"][0]).filter(
      (x) => !filter.includes(x)
    ); //['Id', 'Sản Phẩm', 'Tên Sản Phẩm', 'Đơn giá', 'Số Lượng', 'Đơn Vị Tính', 'Thành Tiền', 'Ngày', 'Giá Nhập', 'Đơn Hàng']

    let columns = isPageA5
      ? ["STT", ...columnsChitiets]
      : columnsChitiets.filter((x) => x != "ĐV");
    var html = "";
    const inforStore = this.addInforStore(donhang);
    html += inforStore;

    var kh = await this.getKh(donhang["Khách Hàng"], donhang["Id"]);
    html += kh;
    const head = this.setHeadTable(columns);
    const body = this.setBodyTable(donhang, isPageA5, columns);
    const foot = this.setFootTable(donhang, isPageA5);
    html += this.setTable(head, body, foot);
    const printerWindow = window.open(``, `_blank`);
    printerWindow?.document.write(`
    <!DOCTYPE html>
    <html>
    ${this.addHeader()}
   
    <body  class="${{ classMain }}">
      ${html}
    </body>
    
    </html>
    
    `);

    printerWindow?.document.close();
    printerWindow?.focus();
    printerWindow?.print();
    // mywindow.close();
  }
}
