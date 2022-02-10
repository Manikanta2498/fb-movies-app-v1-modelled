import { TestBed } from '@angular/core/testing';

import { PreconnectService } from './preconnect.service';

describe('PreconnectService', () => {
  let service: PreconnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreconnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
