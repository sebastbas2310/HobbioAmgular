import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent implements OnInit {
  // Paso actual
  step: 1 | 2 = 1;
  loading = false;

  requestForm!: FormGroup; // pedir código (email)
  resetForm!: FormGroup;   // restablecer (email, code, newPass, confirm)

  // UI
  showPassword = false;
  showConfirm = false;
  simulatedCode = ''; // Si simulamos backend

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router // cambiado a public para uso en plantilla si hace falta
  ) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.matchPasswords('newPassword', 'confirmPassword') });
  }

  private matchPasswords(passwordKey: string, confirmKey: string) {
    return (group: FormGroup) => {
      const pw = group.controls[passwordKey];
      const cpw = group.controls[confirmKey];
      if (!pw || !cpw) return null;
      return pw.value === cpw.value ? null : { passwordsMismatch: true };
    };
  }

  // Paso 1: solicitar código
  async requestCode() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const email = this.requestForm.value.email;

    try {
      // cast a any para evitar errores de tipado si el AuthService no declara estos métodos
      const svc = this.authService as any;

      if (svc && svc.requestPasswordReset) {
        // si tu servicio retorna Observable
        await svc.requestPasswordReset(email).toPromise();
        Swal.fire('Hecho', 'Hemos enviado un código a tu correo (revisa spam).', 'success');
      } else {
        // Simulación local (para desarrollo sin backend)
        this.simulatedCode = (Math.floor(1000 + Math.random() * 9000)).toString();
        console.info('[Simulación] Código de recuperación:', this.simulatedCode);
        Swal.fire('Simulado', `Se ha generado un código (testing): ${this.simulatedCode}`, 'info');
      }

      // Prefill y avanzar
      this.resetForm.patchValue({ email });
      this.step = 2;
    } catch (err) {
      console.error('Error solicitando código:', err);
      Swal.fire('Error', 'No se pudo enviar el código. Intenta de nuevo más tarde.', 'error');
    } finally {
      this.loading = false;
    }
  }

  // Paso 2: restablecer contraseña
  async resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, code, newPassword } = this.resetForm.value;

    try {
      const svc = this.authService as any;

      if (svc && svc.resetPassword) {
        // reset y/o verificación según tu API
        await svc.resetPassword(email, code, newPassword).toPromise();
        Swal.fire('Listo', 'Tu contraseña se ha actualizado correctamente.', 'success');
        this.goToLogin();
        return;
      }

      if (svc && svc.verifyResetCode && svc.confirmResetPassword) {
        await svc.verifyResetCode(email, code).toPromise();
        await svc.confirmResetPassword(email, code, newPassword).toPromise();
        Swal.fire('Listo', 'Contraseña actualizada.', 'success');
        this.goToLogin();
        return;
      }

      // Simulación local: verifica código generado al pedirlo
      if (this.simulatedCode && code === this.simulatedCode) {
        Swal.fire('Éxito (simulado)', 'Contraseña cambiada correctamente. Ya puedes iniciar sesión.', 'success');
        this.goToLogin();
        return;
      }

      Swal.fire('Error', 'Código inválido o expirado. Verifica y vuelve a intentar.', 'error');
    } catch (err) {
      console.error('Error reseteando contraseña:', err);
      Swal.fire('Error', 'Ocurrió un error al cambiar la contraseña. Intenta de nuevo.', 'error');
    } finally {
      this.loading = false;
    }
  }

  backToRequest() {
    this.step = 1;
  }

  toggleShowPassword() { this.showPassword = !this.showPassword; }
  toggleShowConfirm() { this.showConfirm = !this.showConfirm; }

  // accesos para template
  get rf() { return this.requestForm.controls as { [key: string]: any }; }
  get tf() { return this.resetForm.controls as { [key: string]: any }; }

  // Reenvío de código (simulado o real)
  async resendCode() {
    const email = this.resetForm.value.email || this.requestForm.value.email;
    if (!email) {
      Swal.fire('Atención', 'Primero ingresa tu correo.', 'info');
      return;
    }
    this.loading = true;
    try {
      const svc = this.authService as any;
      if (svc && svc.resendResetCode) {
        await svc.resendResetCode(email).toPromise();
        Swal.fire('Enviado', 'Se reenvió el código a tu correo.', 'success');
      } else {
        // Simulación
        this.simulatedCode = (Math.floor(1000 + Math.random() * 9000)).toString();
        console.info('[Simulación] Nuevo código:', this.simulatedCode);
        Swal.fire('Simulado', `Código reenviado (testing): ${this.simulatedCode}`, 'info');
      }
    } catch (err) {
      console.error('Error reenviando código:', err);
      Swal.fire('Error', 'No se pudo reenviar el código.', 'error');
    } finally {
      this.loading = false;
    }
  }

  passwordStrength(pass: string) {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  }

  goToLogin() {
    try {
      this.router.navigate(['/login']);
    } catch {
      // si la ruta no existe, simplemente recargar o mostrar mensaje
      console.warn('No se pudo navegar a /login (ruta no encontrada).');
    }
  }
}
