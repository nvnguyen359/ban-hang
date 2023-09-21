import { Component } from "@angular/core";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent {
  isViewMmodule = false;
  ngOnInit(){
    this.isViewMmodule = localStorage.getItem('isViewMmodule') as unknown  as boolean;
  }
  onEventView(event: boolean) {
    this.isViewMmodule = event;
    localStorage.setItem('isViewMmodule',`${event}`)
  }
}
