import {Routes} from '@angular/router';
import { ProfileComponent } from './profileMain/profile.component';
import { authGuard } from 'src/app/guards/auth.guard';

 export const ProfileRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: ProfileComponent,
        }
    ],canActivate: [authGuard]
}]