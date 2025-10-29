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
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'community',
        loadChildren: () =>
          import('./pages/community/community.routes').then((m) => m.CommunityRoutes),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./pages/chat/chatMain/chat.routes').then((m) => m.ChatRoutes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/Settings.routes').then((m) => m.SettingsRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/Profile.routes').then((m) => m.ProfileRoutes),
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
