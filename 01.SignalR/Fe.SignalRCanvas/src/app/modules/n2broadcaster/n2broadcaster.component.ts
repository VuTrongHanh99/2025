import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-n2broadcaster',
  templateUrl: './n2broadcaster.component.html',
  styleUrls: ['./n2broadcaster.component.scss']
})
export class N2broadcasterComponent {
  screenStream!: MediaStream;
  peerConnections: { [viewerId: string]: RTCPeerConnection } = {};
  constructor(private signalR: SignalRService) {
    this.signalR.startConnection();

    this.signalR.on('ViewerId', async (viewerId: string) => {
      const pc = this.createPeerConnection(viewerId);
      this.screenStream.getTracks().forEach(track => pc.addTrack(track, this.screenStream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.signalR.invoke('SendOffer', viewerId, JSON.stringify(offer));
    });

    this.signalR.on('ReceiveAnswer', async (viewerId: string, answer: string) => {
      const pc = this.peerConnections[viewerId];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
    });

    this.signalR.on('ReceiveCandidate', async (viewerId: string, candidate: string) => {
      const pc = this.peerConnections[viewerId];
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
    });
  }
  async start() {
    this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  }

  createPeerConnection(viewerId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection();
    this.peerConnections[viewerId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalR.invoke('SendCandidate', viewerId, JSON.stringify(event.candidate));
      }
    };

    return pc;
  }
}
