import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { authInterceptor } from './auth.interceptor';
import { allNestsResolver } from './resolvers/all-nests.resolver';
import { nestByIdResolver } from './resolvers/nest-by-id.resolver';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: 'allNestsResolver',
      useValue: allNestsResolver
        
    },
    {
      provide: 'nestByIdResolver',
      useValue: nestByIdResolver
        
    },
  ],
};
