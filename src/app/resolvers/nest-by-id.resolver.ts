import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Nest, NestService } from '../services/nest.service';
import { of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

export const nestByIdResolver: ResolveFn<Nest> = (route: ActivatedRouteSnapshot) => {
  const id = route.params['id'];
  const nestService = inject(NestService);

  return nestService.nests$.pipe(
    first(),
    switchMap((nests) => {
      const found = nests.find((n) => n.id === id);
      if (found) {
        return of(found); 
      } else {
        return nestService.getNestById(id);
      }
    })
  );
};
