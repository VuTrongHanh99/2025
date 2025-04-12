import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-screen-share',
  templateUrl: './screen-share.component.html',
  styleUrls: ['./screen-share.component.scss']
})
export class ScreenShareComponent implements OnInit {
  private hubConnection!: signalR.HubConnection;
  private peerConnection!: RTCPeerConnection;
  private videoElement!: HTMLVideoElement;


  constructor(
    // private signalRService: SignalRService
  ) {
  }
  ngOnInit(): void {
    this.videoElement = document.querySelector('video')!;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/signalhub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveSignal', async (user, signal) => {
      const data = JSON.parse(signal);
      if (data.type === 'offer') {
        await this.peerConnection.setRemoteDescription(data);
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.hubConnection.invoke('SendSignal', 'user2', JSON.stringify(answer));
      } else if (data.type === 'answer') {
        await this.peerConnection.setRemoteDescription(data);
      } else if (data.candidate) {
        await this.peerConnection.addIceCandidate(data);
      }
    });

    this.hubConnection.start();
  }

  async start() {
    //Lấy stream(video + audio)
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true // Để lấy luôn cả tiếng
    });
    this.videoElement.srcObject = stream;

    //Tạo peer connection:
    this.peerConnection = new RTCPeerConnection();
    stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.hubConnection.invoke('SendSignal', 'user1', JSON.stringify(event.candidate));
      }
    };

    //Gửi offer qua SignalR:
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.hubConnection.invoke('SendSignal', 'user1', JSON.stringify(offer));
  }


  // private canvas = document.createElement('canvas');
  // private ctx = this.canvas.getContext('2d');
  // async startSharing() {
  //   const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  //   const video = document.createElement('video');
  //   video.srcObject = stream;
  //   video.play();
  //   const sendFrame = () => {
  //     if (this.ctx && video.videoWidth && video.videoHeight) {
  //       this.canvas.width = video.videoWidth;
  //       this.canvas.height = video.videoHeight;
  //       this.ctx.drawImage(video, 0, 0);
  //       const base64 = this.canvas.toDataURL('image/webp');
  //       this.signalRService.sendScreenFrame(base64);
  //     }
  //   };
  //   setInterval(sendFrame, 300); // Gửi mỗi 300ms (có thể điều chỉnh)
  // }
}
