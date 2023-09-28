import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiphisComponent } from './chiphis.component';

describe('ChiphisComponent', () => {
  let component: ChiphisComponent;
  let fixture: ComponentFixture<ChiphisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChiphisComponent]
    });
    fixture = TestBed.createComponent(ChiphisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
