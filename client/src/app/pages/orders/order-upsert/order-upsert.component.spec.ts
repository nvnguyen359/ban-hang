import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpsertComponent } from './order-upsert.component';

describe('OrderUpsertComponent', () => {
  let component: OrderUpsertComponent;
  let fixture: ComponentFixture<OrderUpsertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderUpsertComponent]
    });
    fixture = TestBed.createComponent(OrderUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
