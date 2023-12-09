import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhnComponent } from './ghn.component';

describe('GhnComponent', () => {
  let component: GhnComponent;
  let fixture: ComponentFixture<GhnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GhnComponent]
    });
    fixture = TestBed.createComponent(GhnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
