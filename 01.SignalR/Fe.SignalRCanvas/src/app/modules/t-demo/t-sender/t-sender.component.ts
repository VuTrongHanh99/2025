import { Component, OnInit } from '@angular/core';
import { SignalingService } from 'src/app/services/signaling.service';
import { TSignalingService } from 'src/app/services/t-signaling.service';

@Component({
  selector: 'app-t-sender',
  templateUrl: './t-sender.component.html',
  styleUrls: ['./t-sender.component.scss']
})
export class TSenderComponent implements OnInit {

  constructor(private signaling: TSignalingService) { }

  async ngOnInit() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const video = document.querySelector('video')!;
    video.srcObject = stream;

    this.signaling.startAsSender(stream);
  }

}
