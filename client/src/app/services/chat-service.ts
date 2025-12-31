import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private authService = inject(AuthService);
  private hubUrl = "http://localhost:5000/hubs/chat";

  messageDummy: Message = {
    id: 123,
    senderId: "JACK",
    receiverId: "MY_ID",
    content: "This is a test message",
    createdDate: "1995-05-01",
    isRead: false
  }

  userMessageDummy: Message = {
    id: 2,
    senderId: "fb0bfe2d-c495-4de3-a8fb-138061721025",
    receiverId: "YOU",
    content: "I sent this!",
    createdDate: "1995-05-01",
    isRead: false
  }

  onlineUsers = signal<User[]>([]);
  currentOpenedChat = signal<User | null>(null);
  // chatMessages = signal<Message[]>([this.messageDummy, this.userMessageDummy]);
  chatMessages = signal<Message[]>([]) 
  isLoading = signal<boolean>(false);

  private hubConnection?: HubConnection;

  startConnection(token: string, senderId?: string) {
    this.hubConnection = new HubConnectionBuilder().withUrl(
      `${this.hubUrl}?senderId=${senderId} || ''}`, {
        accessTokenFactory: () => token
      }).withAutomaticReconnect().build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started.')
      })
      .catch((error) => {
        console.log('Connection or login error', error)
      });

    this.hubConnection!.on('OnlineUsers', (users:User[]) => {
      console.log(users);
      this.onlineUsers.update(() =>
        users.filter(user => user.userName !== this.authService.currentLoggedUser!.userName)
      )
    });

    this.hubConnection!.on("ReceiveMessageList", (message) => {
      this.chatMessages.update(messages => [...message, messages]);
      this.isLoading.update(() => false);
    })
  }

  disconnectConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(err => console.log(err));
    }
  }

  status(username: string): string {
    const currentChatUser = this.currentOpenedChat();
    if (!currentChatUser) {
      return 'offline'
    }

    const onlineUser = this.onlineUsers().find(
      (user) => user.userName === username
    );

    return onlineUser?.isTyping ? 'Typing...' : this.isUserOnline();
  }

  isUserOnline(): string {
    let onlineUser = this.onlineUsers().find(
      (user) => user.userName === this.currentOpenedChat()?.userName
    );

    return onlineUser?.isOnline ? 'online' : this.currentOpenedChat()!.userName;
  }
}
