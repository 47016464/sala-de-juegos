import {
  Component,
  OnInit,
  signal
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
export class ChatComponent implements OnInit {

  messages = signal<any[]>([]);
  newMessage = '';
  user: any;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
  ) {}

  async ngOnInit() {

  this.user = await this.authService.getUser();

  const { data } =
    await this.supabaseService.getMessages();

  if (data) {
    this.messages.set(data);
  }

  this.supabaseService.subscribeToMessages(
    (message: any) => {

      this.messages.update(messages => [
        ...messages,
        message
      ]);

    }
  );
}

  async sendMessage() {

    if (!this.newMessage.trim()) return;

    await this.supabaseService.sendMessage(
      this.user,
      this.newMessage
    );

    this.newMessage = '';
  }
}