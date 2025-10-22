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

  private api_url='http://localhost:3000/api/v1/auth'
  
    constructor(private http: HttpClient) { }
  
  
    authenticate(email:string, password:string): Observable<any>{
      const endpoint = `${this.api_url}/login`;
      const body = {email, password};
      return this.http.post(endpoint, body);
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

    forgotPassword(email: string): Observable<any> {
      const endpoint = `${this.api_url}/forgot-password`;
      const body = { email };
      return this.http.post(endpoint, body);
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
      const endpoint = `${this.api_url}/reset-password`;
      const body = { token, newPassword };
      return this.http.post(endpoint, body);
    }

    
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
