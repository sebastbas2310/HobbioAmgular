import { Injectable } from '@angular/core';
import { HttpClient   } from'@angular/common/http';
import { Observable } from 'rxjs';
import { Workers } from 'src/app/models/workers.model';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private servidor = 'http://localhost:3000/worker';

  constructor(private http: HttpClient) { }

   addWorker(worker: Workers): Observable<any>{
    const endpoint = `${this.servidor}/addWorker`;
    return this.http.post<Workers[]>(endpoint, worker);
  }

  getWorkers(): Observable<Workers[]>{
    const endpoint = this.servidor;
    const headers = {
      'Content-Type':"application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    }
    return this.http.get<Workers[]>(endpoint,{headers});
  }

 
   changeWorkerStatus(worker_id?: string, estado?: string){
    const endpoint = `${this.servidor}/ChangeStatus/${worker_id}`;
    const headers = {
      'Content-Type':"application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    }
    const body = {estado};
    return this.http.post<Workers[]>(endpoint,body,{headers});
  }


  getWorkerById(id:string){
    const endpoint = `${this.servidor}/${id}`;
    const headers = {
      'Content-Type':"application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    }
    return this.http.get<Workers>(endpoint,{headers});
  }


 updateWorker(workerId:string, workerData: Workers){
    const endpoint = `${this.servidor}/${workerId}`;
    const headers = {
      'Content-Type':"application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    }
    return this.http.post<Workers>(endpoint, workerData, { headers });
  }

}
