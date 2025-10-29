import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user = {
    name: 'Juan Pérez',
    username: '@juanp',
    bio: 'Artista urbano 🎨 | Amante del skate 🛹 | Medellín 🇨🇴',
    avatar: 'assets/images/avatar.png',
    postsCount: 12,
    followers: 830,
    following: 245,
  };

  communities = [
    { name: 'Graffiti Zone', description: 'Arte urbano y muralismo' },
    { name: 'Skate Medellín', description: 'Eventos y spots locales' },
    { name: 'Cultura HipHop', description: 'Rap, breakdance y arte' },
  ];

  posts = [
    { id: 1, image: 'assets/images/graffiti1.jpg', caption: 'Centro 🎭🔥' },
    { id: 2, image: 'assets/images/skate.jpg', caption: 'Skate en la 70' },
    { id: 3, image: 'assets/images/mural.jpg', caption: 'Colores nuevos' },
    { id: 4, image: 'assets/images/park.jpg', caption: 'Sesión al aire libre' },
    { id: 5, image: 'assets/images/art.jpg', caption: 'Street vibes' },
  ];
}
