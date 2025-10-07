import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './pages/authentication/side-register/side-register.component';
import { AppForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppResetPasswordComponent } from './reset-password/reset-password.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'forgot-password',
        component: AppForgotPasswordComponent,
      },
      {
        path: 'reset-password',
        component: AppResetPasswordComponent,
      }
    ],
  },
];
