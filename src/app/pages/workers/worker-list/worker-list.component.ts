import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { Workers } from 'src/app/models/workers.model';
import { WorkerService } from 'src/app/services/workers/worker.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-worker-list',
  imports: [MaterialModule, CommonModule],
  templateUrl: './worker-list.component.html',
  styleUrl: './worker-list.component.scss'
})
export class WorkerListComponent {
  workerList: Workers[] = [];

  constructor(private workerService: WorkerService, private router: Router) {
    this.workerList = [];
  }

  ngOnInit() {
    this.getWorker();
  }

  getWorker() {
    this.workerService.getWorkers().subscribe({
      next: (res) => {
        this.workerList = res;
        console.log(this.workerList);
      },
      error: (err) => {
        if (err.status === 403) {
          localStorage.removeItem('AuthToken');
          // this.router
        }
      }
    });
  }

  goToWorkerForm(id?: string) {
    if (id) {
      this.router.navigate(['workers/form', id]);
    }
  }

  goToWorkerFormadd() {
    this.router.navigate(['workers/form']);
  }

  getWorkerById(id: string): Observable<Workers> {
    return this.workerService.getWorkerById(id);
  }

  openWorkerDetails(worker: Workers): void {
    Swal.fire({
      title: `<strong>Detalles del Trabajador</strong>`,
      html: `
        <p><strong>ID:</strong> ${worker.worker_id}</p>
        <p><strong>Nombre:</strong> ${worker.worker_name}</p>
        <p><strong>Email:</strong> ${worker.email}</p>
        <p><strong>Estado:</strong> ${worker.worker_status}</p>
        <p><strong>Rol:</strong> ${worker.worker_rol}</p>
        <p><strong>Salario:</strong> ${worker.salary}</p>
        <p><strong>Teléfono:</strong> ${worker.phone_number}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }
}
