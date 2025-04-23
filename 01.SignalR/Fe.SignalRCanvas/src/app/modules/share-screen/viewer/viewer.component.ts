import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SignalingService } from 'src/app/services/signaling.service';

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
  @ViewChild('remoteVideo', { static: true }) remoteVideoRef!: ElementRef;
  remoteVideo!: HTMLVideoElement;
  constructor(
    private signalingService: SignalingService
  ) {

  }

  ngOnInit() {
    this.remoteVideo = this.remoteVideoRef.nativeElement;
    this.peerConnection = new RTCPeerConnection();
    // Nhận track từ người chia sẻ và phát lên video
    const remoteStream = new MediaStream();
    this.peerConnection.ontrack = (event) => {
      remoteStream.addTrack(event.track);
      this.remoteVideo.srcObject = remoteStream;
    };
    // Khi nhận ICE candidate
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.hubConnection.invoke('SendSignal', 'user1', JSON.stringify(event.candidate));
      }
    };
    // Kết nối SignalR
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/signal')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveSignal', async (user, signal) => {
      const data = JSON.parse(signal);
      // Khi nhận offer từ user1
      if (data.type === 'offer') {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data));

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        this.hubConnection.invoke('SendSignal', 'user1', JSON.stringify(answer));
      }
      // Khi nhận ICE candidate
      if (data.candidate) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
        } catch (err) {
          console.error('Error adding ICE candidate', err);
        }
      }
    });
    this.hubConnection.start();



    // this.videoElement = document.querySelector('video')!;
    // // this.signaling.startConnection();
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl('https://localhost:5001/signal')
    //   .withAutomaticReconnect()
    //   .build();
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
    // this.hubConnection.start();


    // debugger
    // this.hubConnection.on('ReceiveSignal', (data) => {
    //   const signal = JSON.parse(data);
    //   // xử lý offer / answer / iceCandidate
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
  async connectToScreenShare() {
    const peer = new RTCPeerConnection();

    peer.ontrack = (event) => {
      const stream = event.streams[0];
      const videoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
      videoElement.srcObject = stream;
    };

    peer.onicecandidate = event => {
      if (event.candidate) {
        this.signalingService.sendCandidate(event.candidate, 'clientA');
      }
    };

    this.signalingService.onOffer = async (offer) => {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      this.signalingService.sendAnswer(answer, 'clientA');
    };

    this.signalingService.onCandidate = async (candidate) => {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    };
    //
    //Old cũ
    //
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
}
