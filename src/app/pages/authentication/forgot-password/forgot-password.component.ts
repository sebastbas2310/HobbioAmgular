import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './forgot-password.component.html',
})
export class AppForgotPasswordComponent {
  constructor(private router: Router, private authService: AuthService) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isLoading = false;

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const { email } = this.form.value;

    this.authService.forgotPassword(email || '').subscribe({
      next: (res) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Solicitud enviada',
          text: 'Si el correo está asociado a una cuenta, se enviará un enlace de recuperación.',
          icon: 'success',
          confirmButtonText: 'Entendido',
        }).then(() => {
          this.router.navigate(['/authentication']);
        });
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudo procesar la solicitud. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.log(err);
      },
    });
  }

  goBackToLogin() {
    this.router.navigate(['/authentication']);
  }
}
