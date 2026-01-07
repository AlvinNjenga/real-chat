import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ChatBox } from "../chat-box/chat-box";
import { VideoChatService } from '../../services/video-chat-service';
import { MatDialog } from '@angular/material/dialog';
import { VideoChat } from '../../video-chat/video-chat';

@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, MatIconModule, FormsModule, ChatBox],
  templateUrl: './chat-window.html',
  styles: ``,
})
export class ChatWindow {
  @ViewChild('chatBox') chatContainer?: ElementRef;
  dialog = inject(MatDialog);

  chatService = inject(ChatService);
  signalRService = inject(VideoChatService);
  message: string = '';

  // TODO: Change to scroll to bottom when message sent.
  sendMessage() { 
    if (!this.message) return;
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  displayDialog(receiverId: string) {
    this.signalRService.remoteUserId = receiverId;

    this.dialog.open(VideoChat, {
      width: "400px",
      height: "600px",
      disableClose: true,
      autoFocus: false
    });
  }

  // TODO: Fix this.
  private scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollBottom = 
        this.chatContainer.nativeElement.scrollHeight;
    }
  }
}
