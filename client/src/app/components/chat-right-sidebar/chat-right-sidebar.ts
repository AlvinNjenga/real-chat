import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-right-sidebar',
  imports: [CommonModule],
  templateUrl: './chat-right-sidebar.html',
  styles: ``,
})
export class ChatRightSidebar {
  chatService = inject(ChatService);
}
