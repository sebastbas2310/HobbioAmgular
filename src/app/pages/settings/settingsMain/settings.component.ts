import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';
import { jwtDecode } from 'jwt-decode'; // ✅

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterModule],
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
    this.profileForm = this.fb.group({
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // ✅ correo visible y editable (solo visualmente)
      phone_number: [''],
      things_like: [''],
      profile_img: ['']
    });

    this.loadUserData();
    this.currentRoute = this.router.url;
  }

  /**
   * 🚀 Navegación lateral
   */
  navigate(route: string) {
    this.router.navigate([route]);
    this.currentRoute = route;
  }

  /**
   * 🔹 Cargar datos del usuario autenticado
   */
  loadUserData() {
    const token = this.authService.getToken();
    if (!token) {
      console.error('❌ No se encontró token');
      this.loading = false;
      return;
    }

    let decoded: any;
    try {
      decoded = jwtDecode(token);
    } catch (e) {
      console.error('❌ Error al decodificar token:', e);
      this.loading = false;
      return;
    }

    const userId = decoded?.id || decoded?.user_id || decoded?.sub;
    if (!userId) {
      console.error('❌ El token no contiene un ID de usuario válido:', decoded);
      this.loading = false;
      return;
    }

    this.authService.getUserById(userId).subscribe({
      next: (userData) => {
        if (!userData) {
          console.warn('⚠️ No se encontró información del usuario.');
          this.loading = false;
          return;
        }

        // Cargar datos en el formulario
        this.profileForm.patchValue({
          user_name: userData.user_name,
          email: userData.email,
          phone_number: userData.phone_number,
          things_like: userData.things_like,
          profile_img: userData.profile_img
        });

        this.userName = userData.user_name;
        this.loading = false;
      },
      error: (err) => {
        console.error('⚠️ Error al obtener el usuario:', err);
        this.loading = false;
      }
    });
  }

  /**
   * ✏️ Alternar modo edición
   */
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  /**
   * 💾 Guardar cambios del perfil
   */
  onSubmit() {
    if (this.profileForm.invalid) {
      Swal.fire('Campos incompletos', 'Por favor revisa los campos requeridos', 'warning');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      Swal.fire('Error', 'No se encontró el token de usuario', 'error');
      return;
    }

    const decoded: any = jwtDecode(token);
    const userId = decoded?.id || decoded?.user_id || decoded?.sub;

    if (!userId) {
      Swal.fire('Error', 'No se pudo obtener el usuario desde el token', 'error');
      return;
    }

    // 🔹 Forzar a incluir el email actual aunque esté readonly
    const data = {
      ...this.profileForm.getRawValue(),
      email: this.profileForm.value.email
    };

    this.authService.updateUser(userId, data).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
        this.editMode = false;
      },
      error: (err) => {
        console.error('❌ Error actualizando usuario:', err);
        Swal.fire('Error', err.error?.error || 'No se pudo actualizar el perfil', 'error');
      }
    });
  }

  /**
   * 📸 Subir foto
   */
  onUploadPhoto() {
    Swal.fire('Función en desarrollo', 'Aquí podrás subir una nueva foto de perfil', 'info');
  }
}
