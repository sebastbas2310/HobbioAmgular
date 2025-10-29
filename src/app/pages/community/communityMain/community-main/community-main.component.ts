import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-main.component.html',
  styleUrls: ['./community-main.component.scss']
})
export class CommunitiesComponent implements OnInit {
  searchTerm: string = '';
  filtradas: any[] = []; // tu lista de comunidades filtradas
  userName: string = ''; // 👈 aquí guardaremos el nombre

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserName();
    this.loadCommunities();
  }

  /** 🔹 Obtiene el nombre del usuario desde el backend usando el ID del token */
  loadUserName() {
    const user = this.authService.getUserFromToken();

    if (!user || !user.id) {
      console.warn('No se pudo obtener el usuario desde el token');
      return;
    }

    this.authService.getUserById(user.id).subscribe({
      next: (userData) => {
        this.userName = userData.user_name || 'Usuario';
        console.log('🟢 Usuario cargado:', this.userName);
      },
      error: (err) => {
        console.error('⚠️ Error al cargar usuario:', err);
        this.userName = 'Usuario';
      },
    });
  }

  /** 🔹 Ejemplo: carga inicial de comunidades (puedes adaptarlo a tu API real) */
  loadCommunities() {
    // Simulación: normalmente harías un this.communityService.getAll().subscribe(...)
    this.filtradas = [
      { nombre: 'Gamers Unidos', descripcion: 'Comunidad para amantes de los videojuegos.' },
      { nombre: 'Fotografía', descripcion: 'Comparte tus mejores tomas y aprende técnicas nuevas.' },
      { nombre: 'Lectores del Café', descripcion: 'Club de lectura semanal con libros nuevos cada mes.' },
    ];
  }

  /** 🔹 Filtrado */
  onSearchChange(value: string) {
    this.searchTerm = value;
    // Aquí filtras según tu lógica (ejemplo simple):
    this.filtradas = this.filtradas.filter(c =>
      c.nombre.toLowerCase().includes(value.toLowerCase())
    );
  }
}
