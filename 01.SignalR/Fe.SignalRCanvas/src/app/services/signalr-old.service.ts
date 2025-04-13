import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRoldService {
  private hubConnection!: signalR.HubConnection;
  public onSignalReceived!: (user: string, signal: any) => void;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/signalhub')// Thay bằng URL backend
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => {
      console.log('SignalR Connected.');
    });

    this.hubConnection.on('ReceiveSignal', (user, signalData) => {
      if (this.onSignalReceived) {
        this.onSignalReceived(user, signalData);
      }
    });
  }

  sendSignal(user: string, signalData: any) {
    this.hubConnection.invoke('SendSignal', user, signalData);
  }

  // public startConnection() {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('http://localhost:4200/signalhub') // Thay bằng URL backend
  //     .withAutomaticReconnect()
  //     .build();

  //   return this.hubConnection.start();
  // }

  // public sendScreenFrame(imageBase64: string) {
  //   this.hubConnection.invoke('BroadcastScreen', imageBase64);
  // }

  // public onScreenReceived(callback: (image: string) => void) {
  //   this.hubConnection.on('ReceiveScreen', callback);
  // }
  // public startConnection = () => {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('http://localhost:4200/chathub')
  //     .build();
  //   this.hubConnection
  //     .start()
  //     .then(() => console.log('Connection started'))
  //     .catch(err => console.log('Error while starting connection: ' + err));
  // }

  // public addTransferChartDataListener = () => {
  //   this.hubConnection.on('ReceiveMessage', (user, message) => {
  //     console.log(user, message);
  //   });
  // }
}
