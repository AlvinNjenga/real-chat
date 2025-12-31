import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth-service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-box',
  imports: [MatProgressSpinner, DatePipe, MatIconModule],
  templateUrl: './chat-box.html',
  styles: ``,
})
export class ChatBox {
  chatService = inject(ChatService);
  authService = inject(AuthService);
}
