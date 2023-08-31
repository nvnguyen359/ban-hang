import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportHtmlToPdfComponent } from './export-html-to-pdf.component';

describe('ExportHtmlToPdfComponent', () => {
  let component: ExportHtmlToPdfComponent;
  let fixture: ComponentFixture<ExportHtmlToPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportHtmlToPdfComponent]
    });
    fixture = TestBed.createComponent(ExportHtmlToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
