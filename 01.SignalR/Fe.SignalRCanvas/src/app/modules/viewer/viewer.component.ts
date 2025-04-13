import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  private hubConnection!: signalR.HubConnection;
  private peerConnection!: RTCPeerConnection;
  private videoElement!: HTMLVideoElement;
  imageSrc: string = '';
  constructor(
    private signalRService: SignalRService
  ) { }

  async ngOnInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:4200/signalhub')
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

    // this.signalRService.startConnection().then(() => {
    //   this.signalRService.onScreenReceived((image) => {
    //     this.imageSrc = image;
    //   });
    // });
  }

}
