 import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './reset-password.component.html',
})
export class AppResetPasswordComponent implements OnInit {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  form = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  token: string = '';
  isLoading = false;
  isValidToken = false;

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    // Obtener el token de la URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        // Asumimos que el token es válido y mostramos el formulario
        // La validación real se hace al intentar restablecer la contraseña
        this.isValidToken = true;
      } else {
        this.showExpiredLinkMessage();
      }
    });
  }

  showExpiredLinkMessage() {
    Swal.fire({
      title: 'Enlace expirado',
      text: 'El enlace de recuperación ha expirado. Por favor, inicia el proceso de recuperación nuevamente.',
      icon: 'warning',
      confirmButtonText: 'Iniciar proceso de nuevo',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/authentication/forgot-password']);
      } else {
        this.router.navigate(['/authentication']);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const { newPassword, confirmPassword } = this.form.value;

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.token, newPassword || '').subscribe({
      next: (res) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Contraseña actualizada con éxito',
          text: 'Tu contraseña ha sido restablecida exitosamente.',
          icon: 'success',
          confirmButtonText: 'Iniciar sesión',
        }).then(() => {
          this.router.navigate(['/authentication']);
        });
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 400 || err.status === 410) {
          // Token expirado o inválido
          this.showExpiredLinkMessage();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo restablecer la contraseña. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        console.log(err);
      },
    });
  }

  goBackToLogin() {
    this.router.navigate(['/authentication']);
  }
}
