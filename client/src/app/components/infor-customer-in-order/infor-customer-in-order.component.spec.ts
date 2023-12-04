import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforCustomerInOrderComponent } from './infor-customer-in-order.component';

describe('InforCustomerInOrderComponent', () => {
  let component: InforCustomerInOrderComponent;
  let fixture: ComponentFixture<InforCustomerInOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InforCustomerInOrderComponent]
    });
    fixture = TestBed.createComponent(InforCustomerInOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
