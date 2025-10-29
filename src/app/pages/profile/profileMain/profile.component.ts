import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading = true;

  user = {
    name: 'Usuario',
    username: '@usuario',
    avatar: 'assets/default-avatar.png',
    bio: 'Bio de usuario por defecto.',
    postsCount: 0,
    followers: 0,
    following: 0
  };

  posts: Array<{ id?: string; image: string; caption?: string }> = [];
  communities: Array<{ name: string; description?: string }> = [];
  sidePosts: Array<{ image: string; caption?: string }> = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      this.loadProfile();
    } catch (err) {
      console.error('Error iniciando ProfileComponent:', err);
      this.setFallbackEverything();
    }
  }

  loadProfile() {
    // Intentamos rellenar datos del token (si existe)
    let tokenUser: any = null;
    try {
      tokenUser = this.authService?.getUserFromToken?.() ?? null;
    } catch (err) {
      console.warn('authService.getUserFromToken falló:', err);
      tokenUser = null;
    }

    if (tokenUser) {
      this.user.name = tokenUser.name ?? tokenUser.user_name ?? this.user.name;
      const uname = tokenUser.user_name ?? tokenUser.username ?? this.user.username.replace('@', '');
      this.user.username = uname ? `@${uname}` : this.user.username;
      this.user.avatar = tokenUser.profile_img ?? tokenUser.avatar ?? this.user.avatar;
      this.user.bio = tokenUser.things_like ?? tokenUser.bio ?? this.user.bio;
    } else {
      console.warn('No se encontró usuario en token; usando datos por defecto.');
    }

    // Generamos contenido artificial (sin depender de backend)
    this.generateFakeCommunities();
    this.generateFakePosts();

    // Contadores
    this.user.postsCount = this.posts.length;
    this.user.followers = 342;
    this.user.following = 128;

    this.loading = false;
  }

  generateFakeCommunities() {
    this.communities = [
      { name: 'Frontend Devs', description: 'Angular, React y Vue — comparte recursos y preguntas.' },
      { name: 'Fotografía', description: 'Técnicas, cámaras y composición.' },
      { name: 'Runners', description: 'Rutas, retos y consejos para correr mejor.' },
      { name: 'Cine Indie', description: 'Estrenos, críticas y recomendaciones.' },
      { name: 'Productividad', description: 'Hábitos, herramientas y rutina diaria.' }
    ];
  }

  generateFakePosts() {
    // Picsum para imágenes aleatorias (no dependen de assets locales)
    this.posts = [
      { id: '1', image: 'https://picsum.photos/600/600?random=21', caption: 'Amanecer en la ciudad' },
      { id: '2', image: 'https://picsum.photos/600/600?random=22', caption: 'Tarde de estudio' },
      { id: '3', image: 'https://picsum.photos/600/600?random=23', caption: 'Nuevo prototipo' },
      { id: '4', image: 'https://picsum.photos/600/600?random=24', caption: 'Café y código' },
      { id: '5', image: 'https://picsum.photos/600/600?random=25', caption: 'Salida al parque' },
      { id: '6', image: 'https://picsum.photos/600/600?random=26', caption: 'Foto artística' }
    ];

    // posts laterales (los primeros 4)
    this.sidePosts = this.posts.slice(0, 4).map(p => ({ image: p.image, caption: p.caption }));
  }

  editProfile() {
    try {
      this.router.navigate(['/settings/profile']);
    } catch (err) {
      console.warn('No se pudo navegar a /settings:', err);
      alert('Editar perfil (ruta no disponible).');
    }
  }

  openPost(post: { id?: string; image: string; caption?: string }) {
    try {
      if (post?.id) {
        this.router.navigate(['/post', post.id]);
      } else {
        alert(post.caption ?? 'Abrir publicación');
      }
    } catch (err) {
      console.warn('openPost error:', err);
      alert(post.caption ?? 'Abrir publicación');
    }
  }

  setFallbackEverything() {
    this.user = {
      name: 'Usuario (fallback)',
      username: '@usuario',
      avatar: 'https://picsum.photos/200/200?random=2',
      bio: 'Fallback bio',
      postsCount: 1,
      followers: 0,
      following: 0
    };
    this.posts = [{ image: 'https://picsum.photos/600/600?random=99', caption: 'Fallback post' }];
    this.communities = [{ name: 'Fallback', description: 'Comunidad de fallback' }];
    this.sidePosts = this.posts;
    this.loading = false;
  }
}
