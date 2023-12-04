import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGoodsComponent } from './import-goods.component';

describe('ImportGoodsComponent', () => {
  let component: ImportGoodsComponent;
  let fixture: ComponentFixture<ImportGoodsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportGoodsComponent]
    });
    fixture = TestBed.createComponent(ImportGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
