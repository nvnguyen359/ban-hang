import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangmorongComponent } from './bangmorong.component';

describe('BangmorongComponent', () => {
  let component: BangmorongComponent;
  let fixture: ComponentFixture<BangmorongComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BangmorongComponent]
    });
    fixture = TestBed.createComponent(BangmorongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
