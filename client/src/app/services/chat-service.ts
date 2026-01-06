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
  private hubUrl = "https://localhost:5000/hubs/chat";

  onlineUsers = signal<User[]>([]);
  currentOpenedChat = signal<User | null>(null);
  chatMessages = signal<Message[]>([]) 
  isLoading = signal<boolean>(false);
  nextPage = 2;

  autoScrollEnabled = signal<boolean>(true);

  private hubConnection?: HubConnection;

  // Inside start connection is where you listen for messages
  // e.g. OnlineUsers and ReceiveMessageList etc
  startConnection(token: string, senderId?: string) {
    if (this.hubConnection && this.hubConnection?.state !== HubConnectionState.Disconnected) {
      console.log(this.hubConnection?.state);
      console.log('SignalR is already connected or connecting');
      return;
    }

    if(this.hubConnection) {
      this.hubConnection.off('ReceiveNewMessage');
      this.hubConnection.off('ReceiveMessageList');
      this.hubConnection.off('NotifyTypingToUser');
      this.hubConnection.off('OnlineUsers');
      this.hubConnection.off('Notify');
    }

    this.hubConnection = new HubConnectionBuilder().withUrl(
      `${this.hubUrl}?senderId=${senderId ?? ''}`, {
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
    
    // TODO: Check if this is working.
    this.hubConnection!.on('Notify', (user: User) => {
      Notification.requestPermission().then((result) => {
        if (result == 'granted') {
          new Notification('Active now', {
            body: user.fullName + ' is online now',
            icon: user.profileImage
          });
        }
      });
    });

    this.hubConnection!.on('OnlineUsers', (users:User[]) => {
      this.onlineUsers.update(() =>
        users.filter(user => user.userName !== this.authService.currentLoggedUser!.userName)
      )
    });

    this.hubConnection!.on('NotifyTypingToUser', (senderUserName) => {
      this.onlineUsers.update(users => 
        users.map((user) => {
          if (user.userName === senderUserName) {
            user.isTyping = true;
          }

          return user;
        })
      )

      setTimeout(() => (
        this.onlineUsers.update((users) => 
          users.map((user) => {
            if (user.userName === senderUserName) {
              user.isTyping = false;
            }

            return user;
          })
        )
      ), 3000);
    });

    this.hubConnection!.on("ReceiveMessageList", (messages: Message[]) => {
      console.log("Messages from backend: ", messages);
      this.isLoading.update(() => true);
      this.chatMessages.update(existingMessages => [...messages, ...existingMessages]);
      this.isLoading.update(() => false);
    });

    this.hubConnection!.on("ReceiveNewMessage", (message: Message) => {
      let audio = new Audio('assets/notification.mp3');
      document.title = "New Message";

      this.chatMessages.update((messages) => [...messages, message])
    });
  }

  disconnectConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(err => console.log(err));
      this.hubConnection = undefined;
    }
  }

  sendMessage(message: string) {
    this.chatMessages.update(messages => [
      ...messages,
      {
        content: message,
        senderId: this.authService.currentLoggedUser?.id!,
        receiverId: this.currentOpenedChat()?.id!,
        createdDate: new Date().toString(),
        isRead: false,
        id: 0
      }
    ]);

    this.hubConnection?.invoke("SendMessage", {
      receiverId: this.currentOpenedChat()?.id,
      content: message
    }).then((id) => {
      console.log("message send to: ", id);
    }).catch((error) => {
      console.log(error);
    });
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

  // TODO: Implement page + 1 method for checking if more.
  loadMessages(pageNumber: number = 1) {
    console.log("Page number: ", pageNumber);
    this.isLoading.update(() => true);
    this.hubConnection?.invoke("LoadMessages", this.currentOpenedChat()?.id, pageNumber)
      .then()
      .catch()
      .finally(() => {
        this.isLoading.update(() => false);
      })
  }

  loadMoreMessages() {
    this.loadMessages(this.nextPage);
    this.nextPage++;
  }

  notifyTyping() {
    this.hubConnection!.invoke('NotifyTyping', this.currentOpenedChat()?.userName)
      .then((x) => console.log(x))
      .catch((error: Error) => console.log(error.message));
  }
}
