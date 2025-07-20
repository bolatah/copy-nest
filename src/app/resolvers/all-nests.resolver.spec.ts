import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { allNestsResolver } from './all-nests.resolver';

describe('allNestsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => allNestsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
