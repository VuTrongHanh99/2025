import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class TSignalingService {
  private hubConnection!: signalR.HubConnection;
  private peerConnections: { [viewerId: string]: RTCPeerConnection } = {};
  private senderStream!: MediaStream;
  private readonly rtcConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };
  connect(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/signal') // Update nếu khác
      .withAutomaticReconnect()
      .build();
    this.registerHubEvents();
    return this.hubConnection.start();
  }
  private registerHubEvents() {
    this.hubConnection.on('ReceiveViewer', async (viewerId: string) => {
      const pc = new RTCPeerConnection(this.rtcConfig);
      this.peerConnections[viewerId] = pc;
      this.senderStream.getTracks().forEach(track => pc.addTrack(track, this.senderStream));
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.hubConnection.invoke('SendCandidateToViewer', viewerId, event.candidate);
        }
      };
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.hubConnection.invoke('SendOfferToViewer', viewerId, offer);
    });
    this.hubConnection.on('ReceiveAnswer', async (viewerId: string, answer: RTCSessionDescriptionInit) => {
      const pc = this.peerConnections[viewerId];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });
    this.hubConnection.on('ReceiveCandidateFromViewer', async (viewerId: string, candidate: RTCIceCandidateInit) => {
      const pc = this.peerConnections[viewerId];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }

  async startAsSender(stream: MediaStream) {
    this.senderStream = stream;
    await this.connect();
    await this.hubConnection.invoke('RegisterSender');
  }
  async startAsViewer(videoElement: HTMLVideoElement) {
    await this.connect();
    const pc = new RTCPeerConnection(this.rtcConfig);
    pc.ontrack = (event) => {
      videoElement.srcObject = event.streams[0];
    };
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.hubConnection.invoke('SendCandidateToSender', event.candidate);
      }
    };

    this.hubConnection.on('ReceiveOffer', async (offer: RTCSessionDescriptionInit) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.hubConnection.invoke('SendAnswerToSender', answer);
    });

    this.hubConnection.on('ReceiveCandidateFromSender', async (candidate: RTCIceCandidateInit) => {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    await this.hubConnection.invoke('RegisterViewer');
  }
}
