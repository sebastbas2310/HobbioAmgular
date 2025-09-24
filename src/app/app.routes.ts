import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'workers',
        loadChildren: () =>
          import('./pages/workers/workers.routes').then((m) => m.TrabajadoresRoutes),
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./pages/menu/Menu.routes').then((m) => m.MenuRoutes),
      },
      {
        path: 'ingredients',
        loadChildren: () =>
          import('./pages/ingredients/ingredientsroutes').then((m) => m.ingredientsRoutes),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./pages/tables/table.routes').then((m) => m.tablesRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
