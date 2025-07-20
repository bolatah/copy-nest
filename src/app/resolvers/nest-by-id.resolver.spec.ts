import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { nestByIdResolver } from './nest-by-id.resolver';

describe('nestByIdResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => nestByIdResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
