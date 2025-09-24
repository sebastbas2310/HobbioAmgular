import {Routes} from '@angular/router';
import { WorkerListComponent } from '../workers/worker-list/worker-list.component';
import { WorkerFormComponent } from '../workers/worker-form/worker-form.component';
import { authGuard } from 'src/app/guards/auth.guard';


export const TrabajadoresRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: WorkerListComponent,
        },
        {
            path: 'form', // Ruta para crear un nuevo trabajador
            component: WorkerFormComponent,
        },
        {
            path: 'form/:id', // Ruta para editar un trabajador existente
            component: WorkerFormComponent,
        },
    ],canActivate: [authGuard]
}]