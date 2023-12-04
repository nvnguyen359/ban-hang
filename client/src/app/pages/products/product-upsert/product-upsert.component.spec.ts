import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpsertComponent } from './product-upsert.component';

describe('ProductUpsertComponent', () => {
  let component: ProductUpsertComponent;
  let fixture: ComponentFixture<ProductUpsertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductUpsertComponent]
    });
    fixture = TestBed.createComponent(ProductUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
