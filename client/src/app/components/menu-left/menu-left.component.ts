import { Component } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";

@Component({
  selector: "app-menu-left",
  templateUrl: "./menu-left.component.html",
  styleUrls: ["./menu-left.component.scss"],
})
export class MenuLeftComponent {
  
  constructor(private socket: SocketService) {
    const t = this.socket.getMessage();
    //  console.log(t)
    t.subscribe((x) => {
      console.log('nhan tin nhan ',x)
      if (x?.ver) {
       
        if(!localStorage.getItem('ver')){
          localStorage.setItem('ver',x.ver)
        }else{
          this.ver = x.ver;
        }
      
        console.log(this.ver)
      }
    });
    console.log();
  }
  ver: string = JSON.stringify(localStorage.getItem('ver'));
  links = [
    {
      text: "Trang Chủ",
      link: "/",
      icon: "home",
    },
    {
      text: "Đơn Hàng",
      link: "/order",
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
