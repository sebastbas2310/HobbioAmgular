import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-settings-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings-password.component.html',
  styleUrls: ['./settings-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
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

    const { currentPassword, newPassword } = this.passwordForm.value;

    // Obtenemos el ID del usuario autenticado desde el token
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      Swal.fire('Error', 'No se pudo obtener el usuario autenticado.', 'error');
      return;
    }

    this.isLoading = true;

    this.authService.updateUser(userId, { currentPassword, newPassword }).subscribe({
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
