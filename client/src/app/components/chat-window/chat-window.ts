import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ChatBox } from "../chat-box/chat-box";

@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, MatIconModule, FormsModule, ChatBox],
  templateUrl: './chat-window.html',
  styles: ``,
})
export class ChatWindow {
  @ViewChild('chatBox') chatContainer?: ElementRef;

  chatService = inject(ChatService);
  message: string = '';

  // TODO: Change to scroll to bottom when message sent.
  sendMessage() { 
    if (!this.message) return;
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  // TODO: Fix this.
  private scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollBottom = 
        this.chatContainer.nativeElement.scrollHeight;
    }
  }
}
