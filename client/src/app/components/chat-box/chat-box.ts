import { AfterViewChecked, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth-service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-box',
  imports: [MatProgressSpinner, DatePipe, MatIconModule],
  templateUrl: './chat-box.html',
  styles: [`
        .chat-box {
          scroll-behavior: smooth;
          overflow: hidden;
          overflow-y: scroll;
          padding: 10px;
          flex-direction: column;
          background-color: #f5f5f5;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          height: 85vh;
          border-radius: 5px;
        }

        .chat-box::-webkit-scrollbar {
          width: 5px;
          transition: width 0.3s;
        }

        .chat-box::-webkit-scrollbar-track {
          background-color: transparent;
          border-radius: 10px;
        }        

        .chat-box::-webkit-scrollbar-thumb {
          background-color: grey;
          border-radius: 10px;
        }

        .chat-box:hover::-webkit-scrollbar-thumb {
          background-color: #555;
        }

        .chat-icon {
          width: 44px;
          height: 40px;
          font-size: 48px;
        }
  `],
})
export class ChatBox implements AfterViewChecked {
  @ViewChild('chatBox', {read: ElementRef}) public chatBox?: ElementRef;

  chatService = inject(ChatService);
  authService = inject(AuthService);

  // TODO: Implement this.
  ngAfterViewChecked(): void {
    if (this.chatService.autoScrollEnabled()) {
      // this.scrollToBottom();
    }
  }

  loadMoreMessages() {
    this.chatService.loadMoreMessages()
  }

  // TODO: Implement scrolling better - maybe use a different method?
  scrollToBottom() {
    this.chatService.autoScrollEnabled.set(true);
    this.chatBox!.nativeElement.scrollTo({
      top: this.chatBox!.nativeElement.scrollHeight,
      behavior: 'smooth'
    })
  }
}
