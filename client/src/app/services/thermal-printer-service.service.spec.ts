import { TestBed } from '@angular/core/testing';

import { ThermalPrinterServiceService } from './thermal-printer-service.service';

describe('ThermalPrinterServiceService', () => {
  let service: ThermalPrinterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThermalPrinterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
