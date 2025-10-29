import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

type NotificationItem = {
  id: string;
  type: 'mention' | 'like' | 'follow' | 'system' | 'comment';
  title: string;
  body?: string;
  time: string; // ISO
  read?: boolean;
  relatedUrl?: string;
  avatar?: string;
};

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  loading = true;
  user = { id: 'me', name: 'Tú', avatar: 'https://picsum.photos/seed/me/80/80' };

  // notificaciones artificiales
  notifications: NotificationItem[] = [];
  visibleNotifications: NotificationItem[] = []; // paginado
  perPage = 8;
  page = 1;

  // UI
  filter: 'all' | 'unread' | 'mention' | 'activity' | 'system' = 'all';
  search = '';
  unreadCount = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    try {
      const tokenUser: any = this.authService?.getUserFromToken?.() ?? null;
      if (tokenUser) {
        this.user.id = tokenUser.id ?? this.user.id;
        this.user.name = tokenUser.user_name ?? tokenUser.name ?? this.user.name;
        this.user.avatar = tokenUser.profile_img ?? this.user.avatar;
      }
    } catch (err) {
      console.warn('No se pudo leer user token — usando fallback.', err);
    }

    this.generateFakeNotifications(24);
    this.applyPagination();
    this.updateUnreadCount();
    this.loading = false;
  }

  /* ---------------- generación de datos ---------------- */
  generateFakeNotifications(total = 20) {
    const now = Date.now();
    const types: NotificationItem['type'][] = ['mention', 'like', 'follow', 'system', 'comment'];
    const sampleBodies = [
      'Te llamó la atención en su última publicación.',
      'Le gustó tu foto.',
      'Ha empezado a seguirte.',
      'Actualización importante del sistema.',
      'Comentó: "Buena idea, interesante enfoque."'
    ];

    this.notifications = Array.from({ length: total }).map((_, i) => {
      const type = types[i % types.length];
      const minutesAgo = i * 7 + Math.floor(Math.random() * 12);
      return {
        id: 'n' + (1000 + i),
        type,
        title: this.titleForType(type),
        body: sampleBodies[i % sampleBodies.length],
        time: new Date(now - minutesAgo * 60 * 1000).toISOString(),
        read: Math.random() > 0.5 ? true : false,
        relatedUrl: '/some-route/' + (i + 1),
        avatar: `https://picsum.photos/seed/nt${i}/56/56`
      } as NotificationItem;
    });

    // ordenar por tiempo descendente
    this.notifications.sort((a, b) => (a.time < b.time ? 1 : -1));
  }

  titleForType(type: NotificationItem['type']) {
    switch (type) {
      case 'mention': return 'Te han mencionado';
      case 'like': return 'Nueva reacción';
      case 'follow': return 'Nuevo seguidor';
      case 'system': return 'Notificación del sistema';
      case 'comment': return 'Nuevo comentario';
      default: return 'Notificación';
    }
  }

  /* ---------------- filtrado y búsqueda ---------------- */
  setFilter(f: typeof this.filter) {
    this.filter = f;
    this.page = 1;
    this.applyPagination();
  }

  matchesFilter(n: NotificationItem) {
    if (this.filter === 'all') return true;
    if (this.filter === 'unread') return !n.read;
    if (this.filter === 'mention') return n.type === 'mention';
    if (this.filter === 'activity') return n.type === 'like' || n.type === 'comment' || n.type === 'follow';
    if (this.filter === 'system') return n.type === 'system';
    return true;
  }

  applySearchAndFilter() {
    const q = this.search.trim().toLowerCase();
    return this.notifications.filter(n => {
      if (!this.matchesFilter(n)) return false;
      if (!q) return true;
      const combined = (n.title + ' ' + (n.body || '')).toLowerCase();
      return combined.includes(q);
    });
  }

  /* ---------------- paginación "cargar más" ---------------- */
  applyPagination() {
    const filtered = this.applySearchAndFilter();
    const start = 0;
    const end = this.perPage * this.page;
    this.visibleNotifications = filtered.slice(start, end);
    this.updateUnreadCount();
  }

  loadMore() {
    this.page++;
    this.applyPagination();
  }

  /* ---------------- acciones sobre notificaciones ---------------- */
  markAsRead(n: NotificationItem) {
    n.read = true;
    this.updateUnreadCount();
  }

  markAsUnread(n: NotificationItem) {
    n.read = false;
    this.updateUnreadCount();
  }

  toggleRead(n: NotificationItem) {
    n.read = !n.read;
    this.updateUnreadCount();
  }

  deleteNotification(n: NotificationItem) {
    this.notifications = this.notifications.filter(x => x.id !== n.id);
    this.applyPagination();
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
  }

  clearAll() {
    this.notifications = [];
    this.visibleNotifications = [];
    this.updateUnreadCount();
  }

  openNotification(n: NotificationItem) {
    // marcar leída y navegar si hace falta
    this.markAsRead(n);
    if (n.relatedUrl) {
      try {
        this.router.navigateByUrl(n.relatedUrl);
      } catch {
        // si no hay ruta, mostrar detalle (simulado)
        alert(`${n.title}\n\n${n.body}`);
      }
    } else {
      alert(`${n.title}\n\n${n.body}`);
    }
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0);
  }

  formatTime(iso: string) {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = Math.floor((now.getTime() - d.getTime()) / 60000); // minutos
      if (diff < 1) return 'ahora';
      if (diff < 60) return `${diff}m`;
      if (diff < 60 * 24) return `${Math.floor(diff / 60)}h`;
      return d.toLocaleDateString();
    } catch {
      return '';
    }
  }
}
