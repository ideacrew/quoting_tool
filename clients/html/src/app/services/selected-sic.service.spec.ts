import { TestBed } from '@angular/core/testing';

import { SelectedSicService } from './selected-sic.service';

describe('SelectedSicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedSicService = TestBed.get(SelectedSicService);
    expect(service).toBeTruthy();
  });
});
