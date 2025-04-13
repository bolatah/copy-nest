import { Routes } from '@angular/router';
import { OfflineComponent } from './offline/offline.component';
import { NestContentComponent } from './nest-content/nest-content.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // Public
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, 
    { path: 'offline', component: OfflineComponent, canActivate: [authGuard] }, // Private
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
