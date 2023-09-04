import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnNhapHangComponent } from './on-nhap-hang.component';

describe('OnNhapHangComponent', () => {
  let component: OnNhapHangComponent;
  let fixture: ComponentFixture<OnNhapHangComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnNhapHangComponent]
    });
    fixture = TestBed.createComponent(OnNhapHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
