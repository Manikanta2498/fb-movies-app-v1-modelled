import { TestBed } from '@angular/core/testing';

import { ThanksService } from './thanks.service';

describe('ThanksService', () => {
  let service: ThanksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThanksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
