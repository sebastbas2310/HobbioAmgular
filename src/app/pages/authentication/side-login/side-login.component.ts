import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-side-login',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RecaptchaModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  captchaToken: any | null = null;

  get f() {
    return this.form.controls;
  }

 onCaptchaResolved(token: string | null) {
  this.captchaToken = token;
}


  submit() {
    if (!this.captchaToken) {
      Swal.fire({
        title: 'Captcha requerido',
        text: 'Por favor verifica que no eres un robot.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    if (this.form.invalid) return;

    const { uname, password } = this.form.value;
    this.authService.authenticate(uname || '', password || '').subscribe({
      next: (res) => {
        localStorage.setItem('AuthToken', res.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Error al iniciar sesión verifica tus credenciales',
          icon: 'error',
          confirmButtonText: 'Cool',
        });
        console.log(err);
      },
    });
  }
}
