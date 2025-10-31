import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'heroes',
    loadComponent: () => import('./layout/layout.component'),
    loadChildren: () => import('./heroes/heroes.routes').then((m) => m.HERO_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'heroes',
    pathMatch: 'full'
  }
];
