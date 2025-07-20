import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Nest, NestService } from '../services/nest.service';
import { of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

export const allNestsResolver: ResolveFn<Nest[]> = () => {
  const nestService = inject(NestService);
  return nestService.nests$.pipe(
    first(),
    switchMap((nests) => {
      if (nests.length > 0) {
        return of(nests); 
      } else {
        return nestService.getAllNests();
      }
    })
  );
};
