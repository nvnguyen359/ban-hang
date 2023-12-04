import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { DataService } from "src/app/services/data.service";
import { StatusComponent } from "../status/status.component";
import { DiscountComponent } from "../discount/discount.component";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CommonModule } from "@angular/common";
import { MatDialogRef } from "@angular/material/dialog";
import { OrderUpsertComponent } from "src/app/Pages/orders/order-upsert/order-upsert.component";

@Component({
  selector: "app-infor-customer-in-order",
  templateUrl: "./infor-customer-in-order.component.html",
  styleUrls: ["./infor-customer-in-order.component.scss"],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    AutocompleteComponent,
    StatusComponent,
    DiscountComponent,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class InforCustomerInOrderComponent {
  @Input() inforCustomer?: any;
  @Input() data?: any;
  @Output() eventCustomer = new EventEmitter();
  formGroup?: any;
  customers?: any;
  tiencong?: any;
  optionsCustomer = {
    placeholder: "Danh Bạ",
    name: "name",
    label: "Danh Bạ Khách Hàng",
    required: true,
  };
  selectDv = "1000";
  sumEnd: any = {};
  checkDk = false;
  details: any;
  onDiscount: any = {};
  onUnit: any;
  onCustomer: any = {};
  statusText: any = "Đặt Hàng";
  nameCustomer: any;
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrderUpsertComponent>
  ) {}
  ngOnInit() {
    this.onUnit = parseInt(this.selectDv);
    this.customers = this.data.customers;
    this.dataService.currentMessage.subscribe((data: any) => {
      if (data?.details) {
        this.details = data.details;
        this.sumEnd.quantity = Array.from(
          this.details.map((x: any) => parseInt(x.quantity))
        ).reduce((a: any, b: any) => a + b, 0);
        this.sumEnd.intoMney = Array.from(
          this.details.map((x: any) => parseInt(x.quantity) * parseInt(x.price))
        ).reduce((a: any, b: any) => a + b, 0);
        this.initForm();
        this.onCal();
      }
    });
    this.initForm();
  }
  initForm() {
    // console.log('this.onCustomer',this.onCustomer)
    const order = this.data?.order;
    this.statusText = order?.status || "Đặt Hàng";
    this.formGroup = this.fb.group({
      id: [order?.id],
      shippingFee: 0,
      discount: [order?.discount / parseInt(this.selectDv) || 0],
      wage: [parseInt(order?.wage) / parseInt(this.selectDv) || 0],
      createdAt: [
        new Date(order?.createdAt || new Date()) || new Date(),
        Validators.required,
      ],
      status: [order?.status || this.statusText],
      customerId: [order?.customerId, Validators.required],
      name: [order?.name, Validators.required],
      intoMney: [order?.intoMney],
      pay: [order?.pay],
      quantity: [order?.quantity],
      details: [this.details],
      updatedAt: new Date(order?.updatedAt || new Date()) || new Date(),
    });

    if (this.onCustomer?.id) {
      this.formGroup.controls.customerId.setValue(this.onCustomer.id);
      this.formGroup.controls.name.setValue(this.onCustomer.name);
    }
    if (this.statusText) {
      this.formGroup.controls.status.setValue(this.statusText);
    }
  }
  onSave() {
    this.formGroup.controls.discount.setValue(this.sumEnd.discount);
    this.formGroup.controls.intoMney.setValue(this.sumEnd.intoMney);
    this.formGroup.controls.wage.setValue(this.sumEnd.wage);
    this.formGroup.controls.pay.setValue(this.sumEnd.pay);
    this.formGroup.controls.quantity.setValue(this.sumEnd.quantity);
    const value = this.formGroup.value;
    const orderId = value.id;
    const listDetails = Array.from(value.details).map((x: any) => {
      return {
        id: x.detailsId,
        productId: x.id,
        name: x.name,
        quantity: x.quantity,
        unit: x.unit,
        price: x.price,
        intoMoney: x.quantity * x.price,
        importPrice: x.importPrice,
        orderId: orderId,
        createdAt: new Date(x.createdAt),
        updatedAt: new Date(x.updatedAt),
      };
    });
    delete value.details;
    return { order: value, details: listDetails };
  }
  onSubmit() {
    const save = this.onSave();
    const dt = { order: save.order, details: save.details };
    this.dialogRef.close(dt);
  }
  saveAndPrinter() {
    let save = this.onSave();
    const dsx = { order: save.order, details: save.details };
    this.dataService.sendMessage({ saveOrPrint: dsx });
    this.dialogRef.close(dsx);
  }
  onChangeDiscount(event: any) {
    this.onDiscount = event;
    this.onCal();
  }
  eventChangeStatus(event: any) {
    this.statusText = event.value;
    this.formGroup.controls.status.setValue(event.value);
  }
  selectionChangeUnit(event: any) {
    const value = event.value;
    this.onUnit = parseInt(value);
    this.onCal();
  }
  onKeyPressTable(event: any, item: any, text: string) {
    const val = String.fromCharCode(event.which);
    this.details = Array.from(this.details).map((x: any) => {
      if (x.id == item.id) {
        const val = parseInt(event.target.value);
        if (text == "quantity") {
          x.quantity = val;
        }
        if (text == "price") {
          x.price = val;
        }
      }

      return x;
    });
    this.onCal();
    if (isNaN(parseInt(val))) event.preventDefault();
  }
  onCal() {
    //console.log(this.details)
    this.sumEnd.quantity = Array.from(
      this.details.map((x: any) => parseInt(x.quantity))
    ).reduce((a: any, b: any) => a + b, 0);
    this.sumEnd.intoMney = Array.from(
      this.details.map((x: any) => parseInt(x.quantity) * parseInt(x.price))
    ).reduce((a: any, b: any) => a + b, 0);
    const onUnit = this.onUnit;
    const onDiscount = this.onDiscount;
    this.sumEnd.discount =
      onDiscount["key"] == "vnd"
        ? onDiscount["value"] * onUnit
        : Math.round((this.sumEnd.intoMney * onDiscount["value"]) / 100);
    this.sumEnd.wage = this.formGroup.value.wage * onUnit;
    this.sumEnd.pay =
      this.sumEnd.intoMney - this.sumEnd.discount + this.sumEnd.wage;
    this.details = this.details?.map((x: any) => {
      x.updatedAt = new Date();
      return x;
    });
  }
  onSelecCustomer(event: any) {
    if (!event) return;
    this.onCustomer = event;
    this.formGroup.controls.customerId.setValue(this.onCustomer.id);
    this.formGroup.controls.name.setValue(this.onCustomer.name);
  }
  onDeleteDetail(item: any) {
    const id = item.detailsId;
    this.dataService.sendMessage({ delDetails: id });
    this.dataService.currentMessage.subscribe((result: any) => {
      if (result?.resultDelete) {
        item.quantity = 0;
        this.onCal();
      }
    });
  }
}
