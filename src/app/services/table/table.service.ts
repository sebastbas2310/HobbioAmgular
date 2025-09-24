import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table } from 'src/app/models/tables.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private servidor = 'http://localhost:3000/table';

  constructor(private http: HttpClient) { }

  getTable(): Observable<Table[]> {
    const endpoint = this.servidor;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Table[]>(endpoint, { headers });
  }

  addTable(table: Table): Observable<any> {
    const endpoint = `${this.servidor}/addTable`;
    return this.http.post(endpoint, table);
  }

  updateTableStatus(table: Table): Observable<any> {
    const endpoint = `${this.servidor}/updateTable/${table.table_id}`;
    return this.http.put(endpoint, table);
  }

  // ✅ NUEVO MÉTODO: Eliminar mesa por ID
  deleteTable(tableId: string): Observable<any> {
    const endpoint = `${this.servidor}/deleteTable/${tableId}`;
    return this.http.delete(endpoint);
  }
}
