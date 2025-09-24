import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Table } from 'src/app/models/tables.model';
import { TableService } from 'src/app/services/table/table.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-list',
  imports: [MaterialModule, CommonModule],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent {
  tableList: Table[] = [];

  constructor(private tableService: TableService, private router: Router) {}

  ngOnInit(): void {
    this.getTable();
  }

  getTable(): void {
    this.tableService.getTable().subscribe({
      next: (res) => {
        this.tableList = res;
        console.log(this.tableList);
      },
      error: (err) => {
        if (err.status === 403) {
          localStorage.removeItem('AuthToken');
        }
      }
    });
  }

  openTableDetails(table: Table): void {
    let timeLeft = 0;

    if (!table.table_disp) {
      const reservationEndTime = Date.now() + 3600000; // Simula 1 hora restante
      timeLeft = reservationEndTime - Date.now();
    }

    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
      } else {
        timeLeft -= 1000;
      }
    }, 1000);

    Swal.fire({
      title: `<strong>Detalles de la Mesa</strong>`,
      html: `
        <p><strong>ID:</strong> ${table.table_id}</p>
        <p><strong>Tamaño:</strong> ${table.table_size}</p>
        <p><strong>Estado:</strong> ${table.table_disp ? 'Desocupada' : 'Ocupada'}</p>
        ${
          !table.table_disp
            ? `<p><strong>Tiempo Restante:</strong> ${Math.floor(timeLeft / 60000)} minutos</p>`
            : ''
        }
      `,
      confirmButtonText: 'Cerrar'
    }).then(() => {
      clearInterval(interval);
    });
  }

  reserveTable(table: Table): void {
    if (!table.table_disp) {
      Swal.fire({
        icon: 'error',
        title: 'Mesa Ocupada',
        text: 'Esta mesa ya está ocupada y no puede ser reservada.',
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    Swal.fire({
      title: 'Reservar Mesa',
      text: `¿Estás seguro de que deseas reservar la mesa con ID ${table.table_id}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Reservar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        table.table_disp = false;

        this.tableService.updateTableStatus(table).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Mesa Reservada',
              text: `La mesa con ID ${table.table_id} ha sido reservada con éxito.`,
              confirmButtonText: 'Cerrar'
            });

            setTimeout(() => {
              table.table_disp = true;

              this.tableService.updateTableStatus(table).subscribe({
                next: () => {
                  Swal.fire({
                    icon: 'info',
                    title: 'Reserva Expirada',
                    text: `La mesa con ID ${table.table_id} ahora está disponible nuevamente.`,
                    confirmButtonText: 'Cerrar'
                  });
                },
                error: () => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo actualizar el estado de la mesa en la base de datos.',
                    confirmButtonText: 'Cerrar'
                  });
                }
              });
            }, 3600000); // 1 hora
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo reservar la mesa. Inténtalo de nuevo más tarde.',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }

  createNewTable(): void {
    Swal.fire({
      title: 'Crear nueva mesa',
      input: 'number',
      inputLabel: 'Indica el tamaño de la mesa',
      inputAttributes: {
        min: '1',
        step: '1'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor ingresa un tamaño válido (mayor que 0)';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newTableSize = Number(result.value);

        const newTable: Table = {
          table_id: '',
          table_size: newTableSize,
          table_disp: true
        };

        this.tableService.addTable(newTable).subscribe({
          next: () => {
            Swal.fire('Mesa creada', 'La nueva mesa ha sido creada correctamente.', 'success');
            this.getTable();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo crear la mesa. Inténtalo de nuevo.', 'error');
          }
        });
      }
    });
  }

  // NUEVO MÉTODO: Eliminar una mesa
  deleteTable(table: Table): void {
    Swal.fire({
      title: '¿Eliminar mesa?',
      text: `¿Estás seguro de eliminar la mesa con ID ${table.table_id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tableService.deleteTable(table.table_id!).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La mesa fue eliminada correctamente.', 'success');
            this.getTable();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la mesa.', 'error');
          }
        });
      }
    });
  }
}
