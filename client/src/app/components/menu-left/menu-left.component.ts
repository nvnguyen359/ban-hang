import { Component } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";
import '../../general'
import { BaseApiUrl } from "../../general";
@Component({
  selector: "app-menu-left",
  templateUrl: "./menu-left.component.html",
  styleUrls: ["./menu-left.component.scss"],
})
export class MenuLeftComponent {
  constructor(private socket: SocketService) {
    this.getVersion();
    setTimeout(() => {
      this.getVersion();
    }, 5000);
  }
  getVersion() {
    this.socket.getMessage().subscribe((x: any) => {
      if (x?.ver) {
        if (!localStorage.getItem("ver")) {
          localStorage.setItem("ver", x.ver);
        } else {
          this.ver = x.ver;
        }
      }
    });
  }

  ver: string = JSON.stringify(localStorage.getItem("ver"));
  links = [
    {
      text: "Trang Chủ",
      link: "/",
      icon: "home",
    },
    {
      text: "Đơn Hàng",
      link: `/${BaseApiUrl.DonHangs}`,
      icon: "shopping_basket",
    },
    {
      text: "Sản Phẩm",
      link:  `/${BaseApiUrl.SanpPhams}`,
      icon: "spa",
    },
    {
      text: "Nhập Hàng",
      link:  `/${BaseApiUrl.NhapHangs}`,
      icon: "credit_card",
    },
    {
      text: "Khách Hàng",
      link:  `/${BaseApiUrl.KhachHangs}`,
      icon: "account_box",
    },
    {
      text: "Chi Phí",
      link:  `/${BaseApiUrl.ChiPhis}`,
      icon: "money",
    },
    {
      text: "Công Nợ",
      link:  `/${BaseApiUrl.CongNos}`,
      icon: "money",
    },
    {
      text: "Cài Dặt",
      link: "/settings",
      icon: "settings",
    },
  ];
}
