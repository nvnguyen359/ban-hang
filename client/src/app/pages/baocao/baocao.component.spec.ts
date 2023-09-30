import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaocaoComponent } from './baocao.component';

describe('BaocaoComponent', () => {
  let component: BaocaoComponent;
  let fixture: ComponentFixture<BaocaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaocaoComponent]
    });
    fixture = TestBed.createComponent(BaocaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
