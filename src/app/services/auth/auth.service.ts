import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api_url = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  /**
   * ✅ Iniciar sesión
   */
  authenticate(email: string, password: string): Observable<any> {
    const endpoint = `${this.api_url}/login`;
    const body = { email, password };
    return this.http.post(endpoint, body);
  }

  /**
   * ✅ Registrar usuario
   */
  register(data: any): Observable<any> {
    const endpoint = `${this.api_url}/register`;
    return this.http.post(endpoint, data);
  }

  /**
   * ✅ Verificar si un correo ya está registrado
   */
  checkEmail(email: string): Observable<boolean> {
    const endpoint = `${this.api_url}/check-email?email=${encodeURIComponent(email)}`;
    return this.http.get<{ exists: boolean }>(endpoint).pipe(
      map(response => response.exists),
      catchError(() => {
        console.error('Error verificando el correo');
        return [false];
      })
    );
  }
}

/**
 * ✅ Interceptor para manejar errores de autenticación
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/authentication']);
          });
        }
        return throwError(() => error);
      })
    );
  }
}
