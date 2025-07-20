import { TestBed } from '@angular/core/testing';

import { NestService } from './nest.service';

describe('NestService', () => {
  let service: NestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
