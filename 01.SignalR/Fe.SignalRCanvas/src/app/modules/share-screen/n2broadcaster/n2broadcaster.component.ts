import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-n2broadcaster',
  templateUrl: './n2broadcaster.component.html',
  styleUrls: ['./n2broadcaster.component.scss']
})
export class N2broadcasterComponent {
  private stream!: MediaStream;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  constructor(private signalR: SignalRService) { }

  ngOnInit() {
    this.signalR.startConnection();

    this.signalR.viewerJoined$.subscribe(viewerId => this.handleNewViewer(viewerId));
    this.signalR.answerReceived$.subscribe(({ viewerId, answer }) => {
      const pc = this.peerConnections.get(viewerId);
      pc?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.signalR.iceCandidateReceived$.subscribe(({ viewerId, candidate }) => {
      const pc = this.peerConnections.get(viewerId);
      pc?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.signalR.viewerLeft$.subscribe(viewerId => {
      const pc = this.peerConnections.get(viewerId);
      pc?.close();
      this.peerConnections.delete(viewerId);
    });
  }

  async startSharing() {
    this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const video = document.querySelector('video')!;
    video.srcObject = this.stream;
  }

  async handleNewViewer(viewerId: string) {
    const pc = new RTCPeerConnection();
    this.peerConnections.set(viewerId, pc);

    this.stream.getTracks().forEach(track => pc.addTrack(track, this.stream));

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.signalR.sendIceCandidate(viewerId, e.candidate);
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.signalR.sendOffer(viewerId, offer);
  }
}
