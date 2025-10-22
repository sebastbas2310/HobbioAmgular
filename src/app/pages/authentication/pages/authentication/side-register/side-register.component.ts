import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-side-register',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    status: new FormControl('active', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    verificarPassword: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]),
    gustos: new FormControl('', [Validators.required]),
  });

  emailYaRegistrado = false;
  errorMsg: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  // ✅ Verificar si las contraseñas son iguales
  passwordsIguales(): boolean {
    const password = this.form.get('password')?.value;
    const verificarPassword = this.form.get('verificarPassword')?.value;
    return password === verificarPassword;
  }

  // ✅ Detectar si el error viene por correo ya registrado
  correoYaRegistrado(err: any): boolean {
    const msg = err?.error?.error || err?.error?.message || err?.message || '';
    return (
      msg.toLowerCase().includes('correo ya está registrado') ||
      msg.toLowerCase().includes('el correo ya está registrado') ||
      msg.toLowerCase().includes('email ya está registrado')
    );
  }

  // ✅ Enviar el formulario
  submit() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor completa todos los campos correctamente.',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (!this.passwordsIguales()) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    const { uname, password, email, telefono, gustos } = this.form.value;

    const data = {
      user_name: uname || '',
      password: password || '',
      email: email || '',
      phone_number: telefono || '',
      things_like: gustos || '',
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Registro exitoso',
          text: `Usuario: ${uname}\nEmail: ${email}`,
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          this.router.navigate(['/authentication']);
        });
      },
      error: (err) => {
        console.error('Error al registrar:', err);

        if (this.correoYaRegistrado(err)) {
          this.emailYaRegistrado = true;
          Swal.fire({
            title: 'Correo ya registrado',
            text: 'El correo electrónico ingresado ya está asociado a una cuenta existente.',
            icon: 'warning',
            confirmButtonText: 'Ok',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.error || 'No se pudo registrar el usuario.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      }
    });
  }

  // ✅ Verificar correo antes de registrar (opcional)
  verificarCorreo() {
    const email = this.form.get('email')?.value;
    if (!email) return;

    this.authService.checkEmail(email).subscribe({
      next: (exists) => {
        if (exists) {
          this.emailYaRegistrado = true;
          this.form.get('email')?.setErrors({ emailRegistrado: true });
        } else {
          this.emailYaRegistrado = false;
        }
      },
      error: (err) => console.error(err)
    });
  }
}
