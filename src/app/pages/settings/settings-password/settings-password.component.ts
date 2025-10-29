import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './settings-password.component.html',
  styleUrls: ['./settings-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  isLoading = false;
  currentRoute = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentRoute = this.router.url;

    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ✅ Navegación y control de la clase "active"
  navigate(path: string) {
    this.router.navigate([path]);
    this.currentRoute = path;
  }

  // ✅ Verifica que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // ✅ Envía el cambio de contraseña al backend
  onChangePassword() {
    if (this.passwordForm.invalid) {
      Swal.fire('Error', 'Por favor completa los campos correctamente', 'error');
      return;
    }

    const { oldPassword, newPassword } = this.passwordForm.value;

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      Swal.fire('Error', 'No se pudo obtener el usuario autenticado.', 'error');
      return;
    }

    this.isLoading = true;

    this.authService.updateUser(userId, { oldPassword, newPassword }).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire('Éxito', 'Contraseña actualizada correctamente.', 'success');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error actualizando contraseña:', err);
        Swal.fire('Error', 'No se pudo actualizar la contraseña.', 'error');
      },
    });
  }
}
