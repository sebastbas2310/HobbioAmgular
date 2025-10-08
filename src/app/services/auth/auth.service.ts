import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
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
  private user_url = 'http://localhost:3000/users';

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
      const decoded: any = jwtDecode(token);
      return decoded;
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
   * ✅ Obtener perfil del usuario desde el backend (GET /users/:id)
   */
  getUserById(userId: string): Observable<any> {
    const endpoint = `${this.user_url}/${userId}`;
    return this.http.get<any>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * ✅ Actualizar perfil del usuario (PUT /users/:id)
   */
  updateUser(userId: string, data: any): Observable<any> {
    const endpoint = `${this.user_url}/${userId}`;
    return this.http.put<any>(endpoint, data).pipe(catchError(this.handleError));
  }

  /**
   * ✅ Obtener perfil de usuario
   */
  getUserProfile(userId: string) {
    return this.http.get<any>(`/api/users/${userId}`);
  }

  /**
   * ✅ Actualizar perfil de usuario
   */
  updateUserProfile(userId: string, data: any) {
    return this.http.put<any>(`/api/users/${userId}`, data);
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
