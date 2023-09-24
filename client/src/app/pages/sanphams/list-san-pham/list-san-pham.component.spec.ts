import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSanPhamComponent } from './list-san-pham.component';

describe('ListSanPhamComponent', () => {
  let component: ListSanPhamComponent;
  let fixture: ComponentFixture<ListSanPhamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSanPhamComponent]
    });
    fixture = TestBed.createComponent(ListSanPhamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
