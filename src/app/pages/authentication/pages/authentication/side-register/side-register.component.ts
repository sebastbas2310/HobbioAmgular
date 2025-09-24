import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]),
    gustos: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService) {}

  submit() {
    if (this.form.invalid) return;

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
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo registrar el usuario',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        console.log(err);
      }
    });
  }
}
