/*import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material.module';
import { TrabajadoresService } from '../../../services/trabajadores/trabajadores.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MatListModule, MatCardModule, MatIconModule, MaterialModule],
  templateUrl: './lists.component.html',
})
export class AppListsComponent {
  trabajadores: any[] = [];

  constructor(private servicioTrabajador: TrabajadoresService) {}

  ngOnInit() {
    this.servicioTrabajador.ConsultarTrabajadores().subscribe({
      next: (res) => {
        this.trabajadores = res.body || [];
        console.log(this.trabajadores);
      },
      error: (err) => {
        console.error('Error al cargar trabajadores', err);
      },
    });
  }
}
*/