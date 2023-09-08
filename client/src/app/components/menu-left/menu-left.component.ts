import { Component } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";

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
        console.log(this.ver);
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
      link: "/donhang",
      icon: "shopping_basket",
    },
    {
      text: "Sản Phẩm",
      link: "/sanpham",
      icon: "spa",
    },
    {
      text: "Nhập Hàng",
      link: "/nhaphang",
      icon: "credit_card",
    },
    {
      text: "Khách Hàng",
      link: "/customers",
      icon: "account_box",
    },
    {
      text: "Chi Phí",
      link: "/expense",
      icon: "money",
    },
    {
      text: "Cài Dặt",
      link: "/settings",
      icon: "settings",
    },
  ];
}
