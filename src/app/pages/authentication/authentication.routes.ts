import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './pages/authentication/side-register/side-register.component';
import { RecuperarContrasenaComponent } from '../authentication/recuperar-contrasena/recuperar-contrasena.component';

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
        path: 'recuperar-contrasena',
        component: RecuperarContrasenaComponent,
      },
    ],
  },
];
