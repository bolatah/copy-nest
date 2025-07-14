import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const afAuth = inject(AngularFireAuth);

  return from(afAuth.currentUser).pipe(
    switchMap(user => {
      if (!user) {
        return next(req);
      }

      return from(user.getIdToken()).pipe(
        switchMap(token => {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next(cloned);
        })
      );
    })
  );
};
