import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Workers } from 'src/app/models/workers.model';
import { AlertService } from 'src/app/services/alert/alert.service';
import { WorkerService } from 'src/app/services/workers/worker.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './worker-form.component.html',
  styleUrl: './worker-form.component.scss'
})
export class WorkerFormComponent {
  form!: FormGroup;
  editMode: boolean = false;
  workerId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workerService: WorkerService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.workerId = id;
        this.editMode = true;
        this.getWorkerById(id);
      } else {
        this.editMode = false;
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      worker_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      worker_status: ['Activo', Validators.required],
      worker_rol: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      password: ['', Validators.required],
      phone_number: ['', [Validators.required]]
    });
  }

  getWorkerById(id: string): void {
    this.workerService.getWorkerById(id).subscribe({
      next: (worker: Workers) => {
        this.form.patchValue({
          worker_name: worker.worker_name,
          email: worker.email,
          worker_status: worker.worker_status,
          worker_rol: worker.worker_rol,
          salary: worker.salary,
          password: worker.password,
          phone_number: worker.phone_number
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener el trabajador',
          text: 'No se pudo obtener la información del trabajador.'
        });
      }
    });
  }

  guardarWorkerInfo(): void {
    this.alertService.alertaConCorfirmacion("¿Está seguro de guardar los cambios?", "Esta acción no se puede deshacer").then(result => {
      if (!result.isConfirmed) return;

      if (this.form.invalid) {
        this.form.markAllAsTouched();
        Swal.fire({
          icon: 'error',
          title: 'Formulario inválido',
          text: 'Revisa que todos los campos estén correctamente completados.'
        });
        return;
      }

      const workerData: Workers = this.form.value;

      // Validación adicional para número telefónico
      if (workerData.phone_number.length < 10 || workerData.phone_number.length > 15) {
        Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: 'El número telefónico debe tener entre 10 y 15 caracteres.'
        });
        return;
      }

      const peticion = this.editMode && this.workerId
        ? this.workerService.updateWorker(this.workerId, workerData)
        : this.workerService.addWorker(workerData);

      peticion.subscribe({
        next: () => {
          const mensaje = this.editMode ? "modificado" : "creado";
          this.alertService.AlertaCuandoMelo("Excelente", `El trabajador ha sido ${mensaje} correctamente`).then(result => {
            if (result.isConfirmed) {
              this.router.navigate(['/workers']);
            }
          });
        },
        error: (error) => {
          const errores = error?.error?.messages || [error?.error?.error || 'Error desconocido'];
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            html: `<ul style="text-align: left;">${errores.map((e: string) => `<li>${e}</li>`).join('')}</ul>`
          });
        }
      });
    });
  }

  alertaConCorfirmacion(title: string, text: string): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    });
  }
}
