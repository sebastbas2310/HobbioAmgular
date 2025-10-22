import {Routes} from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { ChatMainComponent } from './chat-main/chat-main/chat-main.component';

 export const ChatRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: ChatMainComponent,
        }
    ],canActivate: [authGuard]
}]