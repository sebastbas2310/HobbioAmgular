import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api_url='http://localhost:3000/auth'
  
    constructor(private http: HttpClient) { }
  
  
    authenticate(email:string, password:string): Observable<any>{
      const endpoint = `${this.api_url}/login`;
      const body = {email, password};
      return this.http.post(endpoint, body);
    }

    register(data: any): Observable<any> {
      return this.http.post('http://localhost:3000/user/adduser', data);
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

    validateResetToken(token: string): Observable<any> {
      const endpoint = `${this.api_url}/validate-reset-token`;
      const body = { token };
      return this.http.post(endpoint, body);
    }

    
}

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
