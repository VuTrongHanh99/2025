import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-n2viewer',
  templateUrl: './n2viewer.component.html',
  styleUrls: ['./n2viewer.component.scss']
})
export class N2viewerComponent {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  private peer!: RTCPeerConnection;

  constructor(private signalR: SignalRService) {
    this.init();
  }

  async init() {
    await this.signalR.startConnection();
    console.log('✅ Viewer connected to SignalR');

    this.signalR.on('ReceiveOffer', async (broadcasterId: string, offer: string) => {
      console.log('📨 Received Offer from broadcaster:', broadcasterId);

      this.peer = new RTCPeerConnection();

      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('📤 Sending candidate to broadcaster');
          this.signalR.invoke('SendCandidate', broadcasterId, JSON.stringify(event.candidate));
        }
      };

      this.peer.ontrack = (event) => {
        console.log('🎥 Received stream:', event.streams);
        this.videoElement.nativeElement.srcObject = event.streams[0];
      };

      await this.peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      await this.signalR.invoke('SendAnswer', broadcasterId, JSON.stringify(answer));
    });

    this.signalR.on('ReceiveCandidate', async (peerId: string, candidate: string) => {
      if (this.peer) {
        console.log('📥 Adding candidate:', candidate);
        await this.peer.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
      }
    });

    // Gửi tín hiệu tham gia sau khi kết nối
    await this.signalR.invoke('JoinAsViewer');
    console.log('👋 Joined as viewer');
  }
}
