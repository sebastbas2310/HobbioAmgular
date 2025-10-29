import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profileForm!: FormGroup;
  editMode = false;
  loading = true;
  userName: string = '';
  currentRoute: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Inicializa el formulario
    this.profileForm = this.fb.group({
      user_name: [''],
      email: [''],
      phone_number: [''],
      things_like: [''],
      profile_img: [''],
    });

    this.loadUserData();

    // Guarda la ruta actual para resaltar el item activo
    this.currentRoute = this.router.url;

    // Escucha cambios de ruta para mantener el activo
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  // 🔹 Navegación de la barra lateral
  navigate(route: string) {
    this.router.navigate([route]);
    this.currentRoute = route;
  }

  // 🔹 Cargar datos del usuario
  loadUserData() {
    const user = this.authService.getUserFromToken();

    if (!user || !user.id) {
      console.error('No se pudo obtener el ID del usuario desde el token');
      this.loading = false;
      return;
    }

    this.authService.getUserById(user.id).subscribe({
      next: (userData) => {
        this.profileForm.patchValue(userData);
        this.userName = userData.user_name;
        this.loading = false;
      },
      error: (err) => {
        console.error('⚠️ Error cargando usuario:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Cambiar modo de edición
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  // 🔹 Guardar cambios
  onSubmit() {
    if (this.profileForm.invalid) return;

    const user = this.authService.getUserFromToken();
    if (!user || !user.id) {
      Swal.fire('Error', 'No se pudo obtener el usuario desde el token', 'error');
      return;
    }

    this.authService.updateUser(user.id as string, this.profileForm.value).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
        this.editMode = false;
      },
      error: (err) => {
        console.error('Error actualizando usuario:', err);
        Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
      }
    });
  }

  // 🔹 Subida de foto (simulada)
  onUploadPhoto() {
    Swal.fire('Función en desarrollo', 'Aquí podrás subir una nueva foto de perfil', 'info');
  }
}
