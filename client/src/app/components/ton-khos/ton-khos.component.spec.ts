import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonKhosComponent } from './ton-khos.component';

describe('TonKhosComponent', () => {
  let component: TonKhosComponent;
  let fixture: ComponentFixture<TonKhosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TonKhosComponent]
    });
    fixture = TestBed.createComponent(TonKhosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
