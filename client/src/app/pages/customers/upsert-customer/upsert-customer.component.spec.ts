import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertCustomerComponent } from './upsert-customer.component';

describe('UpsertCustomerComponent', () => {
  let component: UpsertCustomerComponent;
  let fixture: ComponentFixture<UpsertCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertCustomerComponent]
    });
    fixture = TestBed.createComponent(UpsertCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
