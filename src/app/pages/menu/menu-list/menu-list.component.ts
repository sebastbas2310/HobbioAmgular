import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Menu } from 'src/app/models/Menu.model';
import { MenuService } from 'src/app/services/menu/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-list',
  imports: [MaterialModule, CommonModule],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent {
  menuList: Menu[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.getMenu();
  }

  getMenu() {
    this.menuService.getMenu().subscribe({
      next: (res) => {
        this.menuList = res;
        console.log(this.menuList);
      },
      error: (err) => {
        if (err.status === 403) {
          localStorage.removeItem('AuthToken');
          // this.router.navigate(['/login']); // O cualquier acción para manejar el logout
        }
      }
    });
  }

  openMenuDetails(menu: Menu): void {
    Swal.fire({
      title: `<strong>${menu.plate_name}</strong>`,
      html: `
        <img src="${menu.plate_img}" alt="Imagen de ${menu.plate_name}" style="width: 100%; height: auto; margin-bottom: 15px; border-radius: 8px;">
        <p><strong>ID:</strong> ${menu.plate_id}</p>
        <p><strong>Nombre:</strong> ${menu.plate_name}</p>
        <p><strong>Descripción:</strong> ${menu.plate_desc}</p>
        <p><strong>Precio:</strong> $${menu.price}</p>
        <p><strong>Categoría:</strong> ${menu.plate_cat}</p>
        <p><strong>Ingredientes:</strong> ${menu.ingredients}</p>
      `,
      confirmButtonText: 'Cerrar'
    });
  }

  createNewPlate(): void {
    Swal.fire({
      title: 'Crear nuevo plato',
      html:
        `<input id="plate_name" class="swal2-input" placeholder="Nombre del plato">
         <input id="plate_desc" class="swal2-input" placeholder="Descripción">
         <input id="price" type="number" class="swal2-input" placeholder="Precio">
         <input id="plate_img" class="swal2-input" placeholder="URL Imagen">
         <input id="plate_cat" class="swal2-input" placeholder="Categoría">
         <input id="ingredients" class="swal2-input" placeholder="Ingredientes">`,
      focusConfirm: false,
      preConfirm: () => {
        const plate_name = (document.getElementById('plate_name') as HTMLInputElement).value;
        const plate_desc = (document.getElementById('plate_desc') as HTMLInputElement).value;
        const price = Number((document.getElementById('price') as HTMLInputElement).value);
        const plate_img = (document.getElementById('plate_img') as HTMLInputElement).value;
        const plate_cat = (document.getElementById('plate_cat') as HTMLInputElement).value;
        const ingredients = (document.getElementById('ingredients') as HTMLInputElement).value;

        if (!plate_name || !plate_desc || !price || !plate_img || !plate_cat || !ingredients) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return null;
        }

        return { plate_name, plate_desc, price, plate_img, plate_cat, ingredients };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const newPlate: Menu = {
          plate_name: result.value.plate_name,
          plate_desc: result.value.plate_desc,
          price: result.value.price,
          plate_img: result.value.plate_img,
          plate_cat: result.value.plate_cat,
          ingredients: result.value.ingredients,
          is_stock: true // Opcional, según tu lógica
        };

        this.menuService.addPlate(newPlate).subscribe({
          next: () => {
            Swal.fire('¡Plato creado!', '', 'success');
            this.getMenu(); // Refresca la lista después de crear
          },
          error: () => {
            Swal.fire('Error al crear el plato', '', 'error');
          }
        });
      }
    });
  }

  deletePlate(plate: Menu): void {
    Swal.fire({
      title: `¿Estás seguro de eliminar el plato "${plate.plate_name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.deletePlate(plate.plate_id!).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', `El plato "${plate.plate_name}" ha sido eliminado.`, 'success');
            this.getMenu(); // Refresca la lista después de borrar
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el plato. Intenta nuevamente.', 'error');
          }
        });
      }
    });
  }
}
