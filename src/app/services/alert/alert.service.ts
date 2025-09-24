import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  AlertaCuandoMelo(title:string, text: string){
    return Swal.fire({
      icon:"success",
      title: title,
      text: text,
      confirmButtonText: 'Aceptar'
    });
  }

  alertaConCorfirmacion(title:string, text: string){
    return Swal.fire({
      icon:"warning",
      title:title,
      text: text,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText:"Nonas"
    })
  }

  
}