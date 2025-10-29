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

  // ========================================
  // 🟢 AUTENTICACIÓN Y REGISTRO
  // ========================================

  /** ✅ Iniciar sesión y guardar token */
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

  /** ✅ Registrar nuevo usuario */
  register(data: any): Observable<any> {
    const endpoint = `${this.api_url}/register`;
    return this.http.post(endpoint, data).pipe(catchError(this.handleError));
  }

  /** ✅ Verificar si un correo ya está registrado */
  checkEmail(email: string): Observable<boolean> {
    const endpoint = `${this.api_url}/check-email?email=${encodeURIComponent(email)}`;
    return this.http.get<{ exists: boolean }>(endpoint).pipe(
      map(response => response.exists),
      catchError(() => [false])
    );
  }

  // ========================================
  // 🟣 TOKEN Y USUARIO
  // ========================================

  /** ✅ Obtener token guardado en localStorage */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /** ✅ Decodificar token y obtener datos del usuario */
  getUserFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('❌ Error decodificando token', error);
      return null;
    }
  }

  /** ✅ Obtener ID del usuario desde el token */
  getUserIdFromToken(): string | null {
    const decoded = this.getUserFromToken();
    return decoded ? decoded.id || decoded.user_id || null : null;
  }

  // ========================================
  // 🔹 USUARIO (GET / PUT)
  // ========================================

  /** ✅ Obtener perfil del usuario (GET /user/:id) */
  getUserById(userId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.user_url}/${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Actualizar datos del usuario (incluye correo) */
  updateUser(userId: string, data: any): Observable<any> {
    const token = this.getToken();

    // 🔹 Incluimos el email dentro del body si no está presente
    if (!data.email) {
      const user = this.getUserFromToken();
      if (user && user.email) {
        data.email = user.email;
      }
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // 🔹 Ruta correcta: /user/:id
    return this.http.put<any>(`${this.user_url}/${userId}`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Cambiar contraseña (PUT /user/:id/change-password) */
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

  // ========================================
  // 🔴 CERRAR SESIÓN Y ERRORES
  // ========================================

  /** ✅ Cerrar sesión (elimina token) */
  logout(): void {
    localStorage.removeItem('authToken');
  }

  /** ⚠️ Manejo de errores HTTP */
  private handleError(error: HttpErrorResponse) {
    console.error('❌ Error HTTP:', error);
    return throwError(() => error);
  }
}

// ========================================
// 🛡️ INTERCEPTOR PARA TOKENS Y ERRORES 401
// ========================================
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    let request = req;

    // 🔹 Añade token al header si existe
    if (token) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // 🔹 Manejo de errores 401 (sesión expirada)
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
