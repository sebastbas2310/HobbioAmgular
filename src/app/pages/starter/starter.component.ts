import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
  ],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
})
export class StarterComponent {
  posts = [
    {
      user: 'Juan Pérez',
      handle: 'juanp',
      avatar: 'assets/images/avatar.png',
      content: 'Nuevo spot de graffiti en el centro 🎨🔥',
      image: 'https://source.unsplash.com/random/600x400?graffiti',
    },
    {
      user: 'Skate Medellín',
      handle: 'sk8med',
      avatar: 'assets/images/avatar.png',
      content: 'Evento de skate este sábado en la 70 🛹',
      image: 'https://source.unsplash.com/random/600x400?skate',
    },
  ];

  comunidades = [
    { nombre: 'Graffiti Zone', descripcion: 'Arte urbano y muralismo' },
    { nombre: 'Skate Medellín', descripcion: 'Eventos y spots locales' },
    { nombre: 'Cultura HipHop', descripcion: 'Rap, breakdance y arte' },
  ];

  personas = [
    { nombre: 'Carlos G', handle: 'carlitoss', avatar: 'assets/images/avatar.png' },
    { nombre: 'Luisa M', handle: 'luisaart', avatar: 'assets/images/avatar.png' },
    { nombre: 'Andrés T', handle: 'andrest', avatar: 'assets/images/avatar.png' },
  ];

  loading = false;

  onScroll() {
    this.loading = true;
    setTimeout(() => {
      this.posts.push({
        user: 'Nuevo usuario',
        handle: 'nuevo',
        avatar: 'assets/images/avatar.png',
        content: 'Otra publicación agregada por scroll infinito ✨',
        image: 'https://source.unsplash.com/random/600x400?street',
      });
      this.loading = false;
    }, 1500);
  }
}
