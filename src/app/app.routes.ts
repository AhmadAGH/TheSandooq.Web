import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'sandooqs',
    loadComponent: () =>
      import('./components/sandooqs/sandooqs').then((m) => m.SandooqsComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile').then((m) => m.ProfileComponent),
  },
  {
    path: 'sandooqs/:id',
    loadComponent: () =>
      import('./components/sandooq-details/sandooq-details').then(
        (m) => m.SandooqDetailsComponent
      ),
  },
];
