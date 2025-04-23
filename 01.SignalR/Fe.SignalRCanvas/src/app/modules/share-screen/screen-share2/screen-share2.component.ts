import { Component, OnInit } from '@angular/core';
import { SignalingService } from 'src/app/services/signaling.service';

@Component({
  selector: 'app-screen-share2',
  templateUrl: './screen-share2.component.html',
  styleUrls: ['./screen-share2.component.scss']
})
export class ScreenShare2Component implements OnInit {
  private peer!: RTCPeerConnection;
  private videoElement!: HTMLVideoElement;

  constructor(
    private signaling: SignalingService
  ) { }

  ngOnInit(): void {
    this.videoElement = document.querySelector('video')!;
    this.signaling.startConnection();
  }

  async startShare() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    this.videoElement.srcObject = stream;
    //Tạo peer connection:
    this.peer = new RTCPeerConnection();
    stream.getTracks().forEach(track => this.peer.addTrack(track, stream));

    this.peer.onicecandidate = event => {
      if (event.candidate) {
        this.signaling.sendCandidate(event.candidate, 'clientB');
      }
    };

    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    this.signaling.sendOffer(offer, 'clientB');

    this.signaling.onAnswer = async (answer) => {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    };

    this.signaling.onCandidate = async (candidate) => {
      await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
    };
  }

  async connectAsViewer() {
    this.peer = new RTCPeerConnection();

    this.peer.ontrack = (event) => {
      const stream = event.streams[0];
      this.videoElement.srcObject = stream;
      //const video = document.getElementById('remoteVideo') as HTMLVideoElement;
      //video.srcObject = stream;
    };

    this.peer.onicecandidate = event => {
      if (event.candidate) {
        this.signaling.sendCandidate(event.candidate, 'clientA');
      }
    };

    this.signaling.onOffer = async (offer) => {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      this.signaling.sendAnswer(answer, 'clientA');
    };

    this.signaling.onCandidate = async (candidate) => {
      await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
    };
  }

}
