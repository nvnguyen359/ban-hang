import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongnosComponent } from './congnos.component';

describe('CongnosComponent', () => {
  let component: CongnosComponent;
  let fixture: ComponentFixture<CongnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CongnosComponent]
    });
    fixture = TestBed.createComponent(CongnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
