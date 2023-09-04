import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanphamsComponent } from './sanphams.component';

describe('SanphamsComponent', () => {
  let component: SanphamsComponent;
  let fixture: ComponentFixture<SanphamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SanphamsComponent]
    });
    fixture = TestBed.createComponent(SanphamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
