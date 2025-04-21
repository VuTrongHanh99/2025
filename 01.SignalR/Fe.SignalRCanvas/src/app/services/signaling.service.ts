import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalingService {
  private hubConnection!: signalR.HubConnection;
  private peerConnection!: RTCPeerConnection;

  onOffer: (data: any) => void = () => { };
  onAnswer: (data: any) => void = () => { };
  onCandidate: (data: any) => void = () => { };

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/signal')
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().then(() => {
      console.log('SignalR connected');
      this.hubConnection.on('ReceiveOffer', this.onOffer);
      this.hubConnection.on('ReceiveAnswer', this.onAnswer);
      this.hubConnection.on('ReceiveCandidate', this.onCandidate);
    });
  }

  sendSignal(offer: any, to: string) {
    this.hubConnection.invoke('SendSignal', offer, to);
  }

  sendOffer(offer: any, to: string) {
    this.hubConnection.invoke('SendOffer', offer, to);
  }

  sendAnswer(answer: any, to: string) {
    this.hubConnection.invoke('SendAnswer', answer, to);
  }

  sendCandidate(candidate: any, to: string) {
    this.hubConnection.invoke('SendCandidate', candidate, to);
  }
}
