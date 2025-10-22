import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

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
  userName: string = ''; // 👈 guardaremos el nombre aquí

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
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
  }

  /**
   * ✅ Cargar datos del usuario desde el backend usando el ID del token
   */
  loadUserData() {
    const user = this.authService.getUserFromToken();

    if (!user || !user.id) {
      console.error('No se pudo obtener el ID del usuario desde el token');
      this.loading = false;
      return;
    }

    console.log('🟢 ID del usuario decodificado:', user.id);

    this.authService.getUserById(user.id).subscribe({
      next: (userData) => {
        // Pone los datos en el formulario
        this.profileForm.patchValue(userData);

        // Guarda y muestra el nombre
        this.userName = userData.user_name;
        console.log('👤 Nombre del usuario:', this.userName);

        this.loading = false;
      },
      error: (err) => {
        console.error('⚠️ Error cargando usuario:', err);
        this.loading = false;
      }
    });
  }

  /**
   * ✅ Cambiar modo de edición
   */
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  
  /**
   * ✅ Guardar cambios
   */
  onSubmit() {
    if (this.profileForm.invalid) return;

    const user = this.authService.getUserFromToken();
    if (!user || !user.id) {
      Swal.fire('Error', 'No se pudo obtener el usuario desde el token', 'error');
      return;
    }

    this.authService.updateUser(user.id as string, this.profileForm.value).subscribe({
      next: (res) => {
        Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
        this.editMode = false;
      },
      error: (err) => {
        console.error('Error actualizando usuario:', err);
        Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
      }
    });
  }

  /**
   * 📸 Simulación de carga de foto
   */
  onUploadPhoto() {
    Swal.fire('Función en desarrollo', 'Aquí podrás subir una nueva foto de perfil', 'info');
  }
}
