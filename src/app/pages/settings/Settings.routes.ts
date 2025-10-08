import {Routes} from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { SettingsComponent } from './settingsMain/settings.component';

 export const SettingsRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: SettingsComponent,
        }
    ],canActivate: [authGuard]
}]