import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer')
  chatContainer!: ElementRef;

  messages = signal<any[]>([]);
  newMessage = '';
  user: any;

  private channel: any;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
  ) {}

  async ngOnInit() {

    this.user =
      await this.authService.getUser();

    const { data, error } =
      await this.supabaseService.getMessages();

    if (!error && data) {

      this.messages.set(data);

      setTimeout(() => {
        this.scrollToBottom();
      });

    }

    this.channel =
  this.supabaseService.subscribeToMessages(
    (message: any) => {

      const estabaAbajo =
        this.estaCercaDelFinal();

      this.messages.update(messages => {

        const existe =
          messages.some(
            m => m.id === message.id
          );

        if (existe) return messages;

        return [
          ...messages,
          message
        ];

      });

      if (estabaAbajo) {

        setTimeout(() => {
          this.scrollToBottom();
        });

      }

    }
  );
  }

  async sendMessage() {

    if (!this.newMessage.trim()) return;

    try {

      await this.supabaseService.sendMessage(
        this.user,
        this.newMessage
      );

      this.newMessage = '';

      setTimeout(() => {
        this.scrollToBottom();
      });

    } catch (error) {

      console.error(
        'Error enviando mensaje:',
        error
      );

    }
  }

  scrollToBottom() {

  if (!this.chatContainer) return;

  const el =
    this.chatContainer.nativeElement;

  el.scrollTop =
    el.scrollHeight;

}

estaCercaDelFinal(): boolean {

  if (!this.chatContainer) return true;

  const el =
    this.chatContainer.nativeElement;

  return (
    el.scrollHeight
    - el.scrollTop
    - el.clientHeight
  ) < 150;

}

  ngOnDestroy(): void {

    if (this.channel) {

      this.channel.unsubscribe();

    }

  }
}