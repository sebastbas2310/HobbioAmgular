import {Routes} from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { NotificationsComponent } from './notificationsMain/notifications.component';

 export const NotificationsRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: NotificationsComponent,
        }
    ],canActivate: [authGuard]
}]