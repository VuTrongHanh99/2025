
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  // Subjects để emit event nhận từ server
  offerReceived$ = new Subject<{ viewerId: string, offer: RTCSessionDescriptionInit }>();
  answerReceived$ = new Subject<{ viewerId: string, answer: RTCSessionDescriptionInit }>();
  iceCandidateReceived$ = new Subject<{ viewerId: string, candidate: RTCIceCandidateInit }>();
  viewerJoined$ = new Subject<string>();
  viewerLeft$ = new Subject<string>();
  viewerIdAssigned$ = new Subject<string>(); // Viewer nhận ID từ server
  startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/screenShareHub')
      .withAutomaticReconnect()
      .build();
    this.hubConnection.on('AssignViewerId', (viewerId) => {
      this.viewerIdAssigned$.next(viewerId);
    });
    // Đăng ký các sự kiện từ server
    this.hubConnection.on('ReceiveOffer', (viewerId, offer) => {
      this.offerReceived$.next({ viewerId, offer });
    });

    this.hubConnection.on('ReceiveAnswer', (viewerId, answer) => {
      this.answerReceived$.next({ viewerId, answer });
    });

    this.hubConnection.on('ReceiveIceCandidate', (viewerId, candidate) => {
      this.iceCandidateReceived$.next({ viewerId, candidate });
    });

    this.hubConnection.on('ViewerJoined', (viewerId) => {
      this.viewerJoined$.next(viewerId);
    });

    this.hubConnection.on('ViewerLeft', (viewerId) => {
      this.viewerLeft$.next(viewerId);
    });

    this.hubConnection.on('AssignViewerId', (viewerId) => {
      this.viewerIdAssigned$.next(viewerId);
    });

    return this.hubConnection.start().then(() => {
      console.log('SignalR connected!');
    });
  }
  // Gửi tín hiệu
  sendOffer(viewerId: string, offer: RTCSessionDescriptionInit) {
    return this.hubConnection.invoke('SendOffer', viewerId, offer);
  }

  sendAnswer(viewerId: string, answer: RTCSessionDescriptionInit) {
    return this.hubConnection.invoke('SendAnswer', viewerId, answer);
  }

  sendIceCandidate(viewerId: string, candidate: RTCIceCandidateInit) {
    return this.hubConnection.invoke('SendIceCandidate', viewerId, candidate);
  }

  joinAsViewer() {
    return this.hubConnection.invoke('JoinAsViewer');
  }

  notifyViewerLeft(viewerId: string) {
    return this.hubConnection.invoke('ViewerLeft', viewerId);
  }

  on(method: string, callback: (...args: any[]) => void) {
    this.hubConnection?.on(method, callback);
  }

  invoke(method: string, ...args: any[]) {
    return this.hubConnection?.invoke(method, ...args);
  }
}
