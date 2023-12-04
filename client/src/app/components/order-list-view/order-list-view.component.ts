import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-list-view',
  templateUrl: './order-list-view.component.html',
  styleUrls: ['./order-list-view.component.scss']
})
export class OrderListViewComponent {
  @Input() inputData:any;
  ngOnInit(){
   // console.log(this.inputData)
  }
}
