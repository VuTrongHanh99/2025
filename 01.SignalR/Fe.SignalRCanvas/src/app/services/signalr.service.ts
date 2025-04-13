
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  // public startConnection(): void {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('https://localhost:5001/screenShareHub')
  //     .withAutomaticReconnect()
  //     .build();

  //   this.hubConnection.start().catch(err => console.error('Error starting SignalR connection:', err));
  // }
  async startConnection() {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/screenShareHub')
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      console.log('SignalR connected');
    } catch (err) {
      console.error('SignalR start error:', err);
    }
  }


  on(method: string, callback: (...args: any[]) => void) {
    this.hubConnection?.on(method, callback);
  }

  invoke(method: string, ...args: any[]) {
    return this.hubConnection?.invoke(method, ...args);
  }
}
