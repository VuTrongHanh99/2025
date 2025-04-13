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

    // this.hubConnection.on('ReceiveSignal', async (user, signal) => {
    //   const data = JSON.parse(signal);
    //   if (data.type === 'offer') {
    //     await this.peerConnection.setRemoteDescription(data);
    //     const answer = await this.peerConnection.createAnswer();
    //     await this.peerConnection.setLocalDescription(answer);
    //     this.hubConnection.invoke('SendSignal', 'user2', JSON.stringify(answer));
    //   } else if (data.type === 'answer') {
    //     await this.peerConnection.setRemoteDescription(data);
    //   } else if (data.candidate) {
    //     await this.peerConnection.addIceCandidate(data);
    //   }
    // });

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
