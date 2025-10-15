import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api_url = 'http://localhost:3000/auth';
  private user_url = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  /**
   * ✅ Iniciar sesión y guardar token
   */
  authenticate(email: string, password: string): Observable<any> {
    const endpoint = `${this.api_url}/login`;
    const body = { email, password };

    return this.http.post(endpoint, body).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * ✅ Registrar usuario
   */
  register(data: any): Observable<any> {
    const endpoint = `${this.api_url}/register`;
    return this.http.post(endpoint, data).pipe(catchError(this.handleError));
  }

  /**
   * ✅ Verificar si un correo ya está registrado
   */
  checkEmail(email: string): Observable<boolean> {
    const endpoint = `${this.api_url}/check-email?email=${encodeURIComponent(email)}`;
    return this.http.get<{ exists: boolean }>(endpoint).pipe(
      map(response => response.exists),
      catchError(() => [false])
    );
  }

  /**
   * ✅ Obtener token guardado
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * ✅ Decodificar token y obtener datos del usuario
   */
  getUserFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  /**
   * ✅ Obtener ID del usuario desde el token
   */
  getUserIdFromToken(): string | null {
    const decoded = this.getUserFromToken();
    return decoded ? decoded.id || decoded.user_id || null : null;
  }

  /**
   * ✅ Obtener perfil del usuario (GET /user/:id)
   */
  getUserById(userId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.user_url}/${userId}`, { headers });
  }

  /**
 * ✅ Cambiar contraseña del usuario (PUT /user/:id/change-password)
 */
changePassword(currentPassword: string, newPassword: string): Observable<any> {
  const userId = this.getUserIdFromToken();
  const token = this.getToken();

  if (!userId || !token) {
    return throwError(() => new Error('Usuario no autenticado'));
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const body = { currentPassword, newPassword };

  return this.http
    .put(`${this.user_url}/${userId}/change-password`, body, { headers })
    .pipe(catchError(this.handleError));
}


  /**
   * ✅ Actualizar perfil del usuario (PUT /user/:id)
   */
  updateUser(userId: string, data: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<any>(`${this.user_url}/${userId}/change-password`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * ✅ Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * ⚠️ Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error HTTP:', error);
    return throwError(() => error);
  }
}

/**
 * ✅ Interceptor para manejar autenticación y errores 401
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            localStorage.removeItem('authToken');
            this.router.navigate(['/authentication']);
          });
        }
        return throwError(() => error);
      })
    );
  }
}
