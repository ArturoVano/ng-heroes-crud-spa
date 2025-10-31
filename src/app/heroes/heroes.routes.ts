import { Routes } from '@angular/router';

export const HERO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./heroes-list/heroes.component')
  },
  {
    path: 'add',
    loadComponent: () => import('./manage-hero/manage-hero.component')
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./manage-hero/manage-hero.component')
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  }
];
