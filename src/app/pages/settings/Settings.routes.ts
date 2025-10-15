import {Routes} from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { SettingsComponent } from './settingsMain/settings.component';
import { ChangePasswordComponent } from './settings-password/settings-password.component';

 export const SettingsRoutes: Routes = [{
    path: '',
    children: [
        {
            path: 'profile',
            component: SettingsComponent,
        },
        {
            path: 'password',
            component: ChangePasswordComponent,
        }
        
    ],canActivate: [authGuard]
}]