import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';  

interface chat {
  nombre: string;
  mensaje: string;
  estado: string;
  imagen: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})
export class ChatMainComponent implements OnInit {
  chat: chat[] = [
    { nombre: 'El_pepe', mensaje: 'Mano no se vos decime', estado: 'ocupado', imagen: 'https://i.imgur.com/h6w6mE2.png' },
    { nombre: 'Cartman', mensaje: 'pudr*te kyle', estado: 'última conexión hace 2 horas', imagen: 'https://i.imgur.com/FfF6HRA.png' },
    { nombre: 'Rick', mensaje: 'Vamos a tomar', estado: 'en línea', imagen: 'https://i.imgur.com/3y3KzSt.png' },
    { nombre: 'Arepacosmica', mensaje: 'Arepita', estado: 'en línea', imagen: 'https://i.imgur.com/nP0kUPD.png' },
    { nombre: 'cubito', mensaje: '', estado: 'en línea', imagen: 'https://i.imgur.com/OKjRk5m.png' }
  ];

  filtrados: chat[] = [];
  searchTerm = '';
  private search$ = new Subject<string>();

  ngOnInit(): void {
    this.filtrados = this.chat;
    this.search$.pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(term => {
        const t = term.toLowerCase().trim();
        this.filtrados = t ? this.chat.filter(a => a.nombre.toLowerCase().includes(t)) : this.amigos;
      });
  }

  onSearchChange(value: string): void {
    this.search$.next(value);
  }
}

