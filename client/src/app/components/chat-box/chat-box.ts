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
  styles: [`
        .chat-box {
          scroll-behaviour: smooth;
          overflow: hidden;
          overflow-y: scroll;
          padding: 10px;
          flex-direction: column;
          background-color: #f5f5f5;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          height: 100vh;
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
export class ChatBox {
  chatService = inject(ChatService);
  authService = inject(AuthService);
}
