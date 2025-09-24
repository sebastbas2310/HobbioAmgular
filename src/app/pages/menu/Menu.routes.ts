import {Routes} from '@angular/router';
import { MenuListComponent } from '../menu/menu-list/menu-list.component';
import { MenuBuyComponent } from '../menu/menu-buy/menu-buy.component';
import { MenuDescComponent } from '../menu/menu-desc/menu-desc.component'; 
import { MenuFormComponent } from './menu-form/menu-form.component';
import { authGuard } from 'src/app/guards/auth.guard';

 export const MenuRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: MenuListComponent,
        },
        {
            path: '',
            component: MenuBuyComponent,
        },
        {
            path: '',
            component: MenuFormComponent,
        },
        {
            path: '',
            component: MenuDescComponent, 
        },
    ],canActivate: [authGuard]
}]