import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from 'src/app/models/Menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private servidor = 'http://localhost:3000/menu';

  constructor(private http: HttpClient) { }

  getMenu(): Observable<Menu[]> {
    const endpoint = this.servidor;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Menu[]>(endpoint, { headers });
  }

  addPlate(menu: Menu): Observable<any> {
    const endpoint = `${this.servidor}/addPlate`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.post(endpoint, menu, { headers });
  }

  deletePlate(plate_id: string): Observable<any> {
    const endpoint = `${this.servidor}/deletePlate/${plate_id}`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.delete(endpoint, { headers });
  }
}
