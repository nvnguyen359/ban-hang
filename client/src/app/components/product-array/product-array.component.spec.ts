import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductArrayComponent } from './product-array.component';

describe('ProductArrayComponent', () => {
  let component: ProductArrayComponent;
  let fixture: ComponentFixture<ProductArrayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductArrayComponent]
    });
    fixture = TestBed.createComponent(ProductArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
