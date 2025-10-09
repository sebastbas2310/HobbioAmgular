import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface Comunidad {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-comunidades',
  templateUrl: './community-main.component.html',
  styleUrls: ['./community-main.component.scss']
})
export class CommunityMainComponent implements OnInit {

  comunidades: Comunidad[] = [
    { id: 1, nombre: 'los silsoneros', descripcion: 'los miembros de esta comunidad sienten mucho amor por el silson.' },
    { id: 2, nombre: 'amantes de los libros', descripcion: 'los miembros de esta comunidad sienten mucho amor por las letras.' },
    { id: 3, nombre: 'amantes de los perros', descripcion: 'los miembros de esta comunidad sienten mucho amor por los perros.' },
    { id: 4, nombre: 'los marianos', descripcion: 'los miembros de esta comunidad sienten mucho amor por la bareta.' }
  ];

  filtradas: Comunidad[] = [];
  searchTerm = '';
  private search$ = new Subject<string>();

  ngOnInit(): void {
    this.filtradas = this.comunidades;

    // Escucha de cambios en el buscador con debounce
    this.search$.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(term => {
      const t = term.toLowerCase().trim();
      this.filtradas = !t
        ? this.comunidades
        : this.comunidades.filter(c =>
            c.nombre.toLowerCase().includes(t) ||
            c.descripcion.toLowerCase().includes(t)
          );
    });
  }

  onSearchChange(value: string): void {
    this.search$.next(value);
  }
}
