import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtComponent } from './debt.component';

describe('DebtComponent', () => {
  let component: DebtComponent;
  let fixture: ComponentFixture<DebtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebtComponent]
    });
    fixture = TestBed.createComponent(DebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
