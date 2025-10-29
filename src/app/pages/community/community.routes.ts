import {Routes} from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { CommunitiesComponent} from './communityMain/community-main/community-main.component';

 export const CommunityRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: CommunitiesComponent,
        }
    ],canActivate: [authGuard]
}]