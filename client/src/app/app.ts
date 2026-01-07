import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { VideoChatService } from './services/video-chat-service';
import { MatDialog } from "@angular/material/dialog";
import { VideoChat } from './video-chat/video-chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'client';

  private signalRService = inject(VideoChatService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog)

  ngOnInit(): void {
    if (!this.authService.getAccessToken) return;
    this.signalRService.startConnection();
    this.startOfferReceive();
  }

  startOfferReceive() {
    this.signalRService.offerReceived.subscribe(async (data) => {
      if (data) {
        // let audio = new Audio('https://localhost:4200/assets/phone-ringing.mp3');
        // audio.play();
        this.dialog.open(VideoChat, {
          width: "400px",
          height: "600px",
          disableClose: false
        });

        this.signalRService.remoteUserId = data.senderId;
        this.signalRService.incomingCall = true;
      }
    })
  }
}
