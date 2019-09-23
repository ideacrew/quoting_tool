import { TestBed } from '@angular/core/testing';

import { EmployerDetailsService } from './employer-details.service';

describe('EmployerDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployerDetailsService = TestBed.get(EmployerDetailsService);
    expect(service).toBeTruthy();
  });
});
