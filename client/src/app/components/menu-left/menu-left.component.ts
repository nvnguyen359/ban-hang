import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],

})
export class MenuLeftComponent {
links=[
  {
    text:'Trang Chủ',
    link:'/',
    icon:'home'
  },
  {
    text:'Đơn Hàng',
    link:'/order',
    icon:'shopping_basket'
  },{
    text:'Nhập Hàng',
    link:'/nhaphang',
    icon:'credit_card'
  },{
    text:'Khách Hàng',
    link:'/customers',
    icon:'account_box'
  },{
    text:'Chi Phí',
    link:'/expense',
    icon:'money'
  },{
    text:'Cài Dặt',
    link:'/settings',
    icon:'settings'
  }
]
}
