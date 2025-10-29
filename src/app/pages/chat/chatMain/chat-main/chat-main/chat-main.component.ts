import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

type Message = {
  id: string;
  fromId: string;
  fromName: string;
  avatar?: string;
  text?: string;
  time: string;
  delivered?: boolean;
  read?: boolean;
  image?: string;
};

type Contact = {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
  lastMessage?: string;
  lastTime?: string; // ISO
};

@Component({
  selector: 'app-chat-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})
export class ChatMainComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  loading = true;

  currentUser = { id: 'me', name: 'Tú', avatar: 'https://picsum.photos/seed/me/80/80' };
  otherUser = { id: 'u2', name: 'Ariadna', avatar: 'https://picsum.photos/seed/ariadna/80/80', online: true };

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContactId: string | null = null;

  messages: Message[] = [];
  newMessageText = '';
  sending = false;
  showAttachments = false;

  // UI: toggle sidebar in small screens
  showSidebar = true;
  contactSearch = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // intenta leer usuario
    try {
      const tokenUser: any = this.authService?.getUserFromToken?.() ?? null;
      if (tokenUser) {
        this.currentUser.id = tokenUser.id ?? this.currentUser.id;
        this.currentUser.name = tokenUser.user_name ?? tokenUser.name ?? this.currentUser.name;
        this.currentUser.avatar = tokenUser.profile_img ?? this.currentUser.avatar;
      }
    } catch (err) {
      console.warn('AuthService.getUserFromToken falló, usando usuario por defecto.', err);
    }

    this.generateFakeContacts();
    // selecciona primer contacto por defecto
    if (this.contacts.length) {
      this.selectContact(this.contacts[0]);
    } else {
      // fallback: conversation artificial
      this.generateFakeConversation();
    }

    this.loading = false;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /* ------------------ CONTACTS ------------------ */

  generateFakeContacts() {
    const now = new Date();
    const t = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();

    this.contacts = [
      { id: 'u2', name: 'Ariadna', avatar: 'https://picsum.photos/seed/ariadna/80/80', online: true, lastMessage: 'Perfecto, lo veo en un rato 👌', lastTime: t(5) },
      { id: 'u3', name: 'Mateo', avatar: 'https://picsum.photos/seed/mateo/80/80', online: false, lastMessage: '¿Listo para el meetup?', lastTime: t(60) },
      { id: 'u4', name: 'Sofía', avatar: 'https://picsum.photos/seed/sofia/80/80', online: true, lastMessage: 'Te envío los archivos', lastTime: t(20) },
      { id: 'u5', name: 'Lucas', avatar: 'https://picsum.photos/seed/lucas/80/80', online: false, lastMessage: 'Buen trabajo 💪', lastTime: t(180) },
      { id: 'u6', name: 'Valentina', avatar: 'https://picsum.photos/seed/valentina/80/80', online: true, lastMessage: '¿Café mañana?', lastTime: t(240) },
    ];

    this.filteredContacts = this.contacts.slice();
  }

  filterContacts() {
    const q = this.contactSearch.trim().toLowerCase();
    this.filteredContacts = q ? this.contacts.filter(c => c.name.toLowerCase().includes(q) || (c.lastMessage || '').toLowerCase().includes(q)) : this.contacts.slice();
  }

  selectContact(contact: Contact) {
    this.selectedContactId = contact.id;
    this.otherUser = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      online: contact.online ?? false
    };
    // cuando seleccionas, generamos una conversación artificial para ese contacto
    this.generateFakeConversationFor(contact.id, contact.name);
    // si estás en móvil, oculta sidebar
    if (window.innerWidth < 820) this.showSidebar = false;
  }

  /* ------------------ MESSAGES ------------------ */

  generateFakeConversation() {
    // conversación por defecto (si no hay contacto seleccionado)
    const now = new Date();
    const t = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();

    this.messages = [
      { id: 'm1', fromId: 'u2', fromName: 'Ariadna', avatar: 'https://picsum.photos/seed/ariadna/80/80', text: '¡Hola! ¿Listo para la presentación hoy?', time: t(120), delivered: true, read: true },
      { id: 'm2', fromId: this.currentUser.id, fromName: this.currentUser.name, avatar: this.currentUser.avatar, text: 'Sí, acabo de terminar los últimos slides.', time: t(115), delivered: true, read: true },
      { id: 'm3', fromId: 'u2', fromName: 'Ariadna', avatar: 'https://picsum.photos/seed/ariadna/80/80', text: '¡Perfecto! pásamelos cuando puedas.', time: t(110), delivered: true, read: true },
    ];
  }

  generateFakeConversationFor(contactId: string, contactName: string) {
    // genera conversaciones diferentes según el contactId (simple variación)
    const now = new Date();
    const t = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();

    if (contactId === 'u3') {
      this.messages = [
        { id: 'm1', fromId: 'u3', fromName: contactName, avatar: 'https://picsum.photos/seed/mateo/80/80', text: '¿Listo para el meetup?', time: t(90), delivered: true, read: true },
        { id: 'm2', fromId: this.currentUser.id, fromName: this.currentUser.name, avatar: this.currentUser.avatar, text: 'Sí, voy a llevar el portátil.', time: t(85), delivered: true, read: true },
      ];
    } else if (contactId === 'u4') {
      this.messages = [
        { id: 'm1', fromId: this.currentUser.id, fromName: this.currentUser.name, avatar: this.currentUser.avatar, text: '¿Recibiste los archivos?', time: t(40), delivered: true, read: true },
        { id: 'm2', fromId: contactId, fromName: contactName, avatar: 'https://picsum.photos/seed/sofia/80/80', text: 'Sí, ya los reviso ahora mismo.', time: t(38), delivered: true, read: false },
      ];
    } else {
      // fallback similar a Ariadna
      this.messages = [
        { id: 'm1', fromId: contactId, fromName: contactName, avatar: `https://picsum.photos/seed/${contactName.toLowerCase()}/80/80`, text: '¡Hola! ¿Cómo vas?', time: t(45), delivered: true, read: true },
        { id: 'm2', fromId: this.currentUser.id, fromName: this.currentUser.name, avatar: this.currentUser.avatar, text: 'Todo bien, avanzando con el proyecto.', time: t(40), delivered: true, read: true },
      ];
    }
  }

  isMine(m: Message) {
    return m.fromId === this.currentUser.id;
  }

  sendMessage() {
    const text = this.newMessageText.trim();
    if (!text) return;
    this.sending = true;

    const msg: Message = {
      id: 'm' + (Math.random() * 100000 | 0),
      fromId: this.currentUser.id,
      fromName: this.currentUser.name,
      avatar: this.currentUser.avatar,
      text,
      time: new Date().toISOString(),
      delivered: true,
      read: false
    };

    this.messages.push(msg);
    // actualiza último mensaje del contacto seleccionado (si aplica)
    this._updateContactLastMessage(this.selectedContactId, msg.text, msg.time);

    this.newMessageText = '';
    this.sending = false;

    setTimeout(() => this.simulateReply(), 900);
  }

  simulateReply() {
    const reply: Message = {
      id: 'm' + (Math.random() * 100000 | 0),
      fromId: this.otherUser.id,
      fromName: this.otherUser.name,
      avatar: this.otherUser.avatar,
      text: this.randomReply(),
      time: new Date().toISOString(),
      delivered: true,
      read: false
    };
    this.messages.push(reply);
    this._updateContactLastMessage(this.selectedContactId, reply.text, reply.time);
  }

  randomReply() {
    const variants = [
      'Perfecto, lo veo en un rato 👌',
      'Genial, gracias ✨',
      'Me encanta el diseño',
      '¿Puedes ajustar el último slide?',
      'Lo reviso y te comento'
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }

  scrollToBottom(): void {
    try {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight + 100;
      }
    } catch {
      // ignore
    }
  }

  toggleAttachments() {
    this.showAttachments = !this.showAttachments;
  }

  attachImage() {
    const imgMsg: Message = {
      id: 'm' + (Math.random() * 100000 | 0),
      fromId: this.currentUser.id,
      fromName: this.currentUser.name,
      avatar: this.currentUser.avatar,
      image: `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/400/300`,
      time: new Date().toISOString(),
      delivered: true
    };
    this.messages.push(imgMsg);
  }

  addEmoji(emoji: string) {
    this.newMessageText = (this.newMessageText ? this.newMessageText + ' ' : '') + emoji;
  }

  formatHour(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  formatLastTime(iso?: string) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      // si es hoy, muestra hora; sino día/mes
      const today = new Date();
      if (d.toDateString() === today.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return d.toLocaleDateString();
    } catch {
      return '';
    }
  }

  private _updateContactLastMessage(contactId: string | null, text?: string, time?: string) {
    if (!contactId) return;
    const c = this.contacts.find(x => x.id === contactId);
    if (c) {
      c.lastMessage = text ?? c.lastMessage;
      c.lastTime = time ?? c.lastTime;
      // refrescar filtro para que UI actualice
      this.filterContacts();
    }
  }
}
