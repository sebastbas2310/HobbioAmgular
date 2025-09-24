import {Routes} from '@angular/router';
import { TableListComponent } from './table-list/table-list.component';
import { TableReservComponent } from './table-reserv/table-reserv.component';
import { TableFormComponent } from './table-form/table-form.component';
import { authGuard } from 'src/app/guards/auth.guard';

export const tablesRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: TableListComponent,
        },
        {
            path: '',
            component: TableFormComponent,
        },
        {
            path: '',
            component: TableReservComponent,
        },
        
    ],canActivate: [authGuard]
}]