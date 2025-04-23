import { Component } from '@angular/core';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-n2viewer',
  templateUrl: './n2viewer.component.html',
  styleUrls: ['./n2viewer.component.scss']
})
export class N2viewerComponent {
  private pc!: RTCPeerConnection;
  private viewerId!: string;

  constructor(private signalR: SignalRService) { }

  ngOnInit() {
    this.signalR.startConnection().then((s) => {
      this.signalR.viewerIdAssigned$.subscribe(id => {
        this.viewerId = id;
      });

      this.signalR.offerReceived$.subscribe(({ viewerId, offer }) => {
        this.handleOffer(offer);
      });

      this.signalR.iceCandidateReceived$.subscribe(({ viewerId, candidate }) => {
        this.pc?.addIceCandidate(new RTCIceCandidate(candidate));
      });
      // CHỜ vài giây hoặc bắt event ready rồi mới gọi
      setTimeout(() => {
        this.signalR.joinAsViewer().then(s => {
          console.log('Thông báo tham gia!');
        }); // thông báo tham gia;
      }, 500); // 👈 Tạm thời chờ nếu cần
    });
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    this.pc = new RTCPeerConnection();

    this.pc.ontrack = (event) => {
      const [stream] = event.streams;
      const video = document.querySelector('video')!;
      video.srcObject = stream;
      console.log('Tham gia!');
    };

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalR.sendIceCandidate(this.viewerId, event.candidate);
      }
    };

    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    this.signalR.sendAnswer(this.viewerId, answer);
  }
}
