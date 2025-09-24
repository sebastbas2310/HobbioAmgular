import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module'; 
import { Ingredient } from 'src/app/models/ingredients.model';
import { ingredientsService } from 'src/app/services/ingredients/ingredients.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingredients-list',
  imports: [ CommonModule, MaterialModule, FormsModule ],
  templateUrl: './ingredients-list.component.html',
  styleUrl: './ingredients-list.component.scss'
})
export class IngredientsListComponent {
  
  ingredientsList: Ingredient[] = [];

  constructor(private IngredientsService: ingredientsService) {}

  ngOnInit() {
    this.getIngredients();
  }

  getIngredients() {
    this.IngredientsService.getIngredients().subscribe({
      next: (res) => {
        this.ingredientsList = res;
      },
      error: (err) => {
        if (err.status === 403) {
          localStorage.removeItem('AuthToken');
        }
      }
    });
  }

  updateQuantity(ingredient: Ingredient): void {
    if (ingredient.amountToAdd > 0) {
      const updatedIngredient: Ingredient = {
        ingredient_id: ingredient.ingredient_id,
        ingredient_name: ingredient.ingredient_name,
        ingredient_type: ingredient.ingredient_type,
        ingredient_cant: ingredient.ingredient_cant + ingredient.amountToAdd,
        amountToAdd: 0
      };

      this.IngredientsService.updateIngredients(updatedIngredient).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Cantidad actualizada correctamente.', 'success');
          this.getIngredients();
        },
        error: () => {
          Swal.fire('Error', 'Error al actualizar la cantidad', 'error');
        }
      });

      ingredient.amountToAdd = 0;
    } else {
      Swal.fire('Error', 'Por favor, ingresa una cantidad válida para sumar.', 'error');
    }
  }

  verInfoIngrediente(ingredient: Ingredient): void {
    Swal.fire({
      title: `<strong>Detalles del Ingrediente</strong>`,
      html: `
        <p><strong>ID:</strong> ${ingredient.ingredient_id ?? 'N/A'}</p>
        <p><strong>Nombre:</strong> ${ingredient.ingredient_name}</p>
        <p><strong>Tipo:</strong> ${ingredient.ingredient_type}</p>
        <p><strong>Cantidad Disponible:</strong> ${ingredient.ingredient_cant}</p>
      `,
      confirmButtonText: 'Cerrar'
    });
  }

  crearIngrediente(): void {
    Swal.fire({
      title: 'Crear nuevo ingrediente',
      html:
        `<input id="nombre" class="swal2-input" placeholder="Nombre">` +
        `<input id="tipo" class="swal2-input" placeholder="Tipo (ej. vegetal, proteína)">` +
        `<input id="cantidad" type="number" class="swal2-input" placeholder="Cantidad" min="1">`,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
        const tipo = (document.getElementById('tipo') as HTMLInputElement).value.trim();
        const cantidadStr = (document.getElementById('cantidad') as HTMLInputElement).value.trim();
        const cantidad = Number(cantidadStr);

        if (!nombre || !tipo || !cantidadStr) {
          Swal.showValidationMessage(`Por favor completa todos los campos`);
          return;
        }
        if (isNaN(cantidad) || cantidad <= 0) {
          Swal.showValidationMessage(`Cantidad debe ser un número mayor a 0`);
          return;
        }
        return { nombre, tipo, cantidad };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newIngredient: Ingredient = {
          ingredient_name: result.value.nombre,
          ingredient_type: result.value.tipo,
          ingredient_cant: result.value.cantidad,
          amountToAdd: 0
        };

        this.IngredientsService.addIngredient(newIngredient).subscribe({
          next: () => {
            Swal.fire('¡Ingrediente creado!', `El ingrediente ${newIngredient.ingredient_name} fue creado exitosamente.`, 'success');
            this.getIngredients();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo crear el ingrediente. Inténtalo más tarde.', 'error');
          }
        });
      }
    });
  }

  confirmDeleteIngredient(ingredient: Ingredient): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminar el ingrediente "${ingredient.ingredient_name}" no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteIngredient(ingredient);
      }
    });
  }

  deleteIngredient(ingredient: Ingredient): void {
    this.IngredientsService.deleteIngredient(ingredient.ingredient_id!).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'El ingrediente ha sido eliminado.', 'success');
        this.getIngredients();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo eliminar el ingrediente. Inténtalo más tarde.', 'error');
      }
    });
  }
}
