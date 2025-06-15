import { Routes } from '@angular/router';
import { OfflineComponent } from './offline/offline.component';
import { NestContentComponent } from './nest-content/nest-content.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Public
  { path: 'privacy-policy', component: PrivacyPolicyComponent }, // Public
  { path: 'offline', component: OfflineComponent }, // Public
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  }, // Private
  { path: 'offline', component: OfflineComponent, canActivate: [authGuard] }, // Private
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
