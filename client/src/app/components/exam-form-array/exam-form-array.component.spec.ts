import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamFormArrayComponent } from './exam-form-array.component';

describe('ExamFormArrayComponent', () => {
  let component: ExamFormArrayComponent;
  let fixture: ComponentFixture<ExamFormArrayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamFormArrayComponent]
    });
    fixture = TestBed.createComponent(ExamFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
