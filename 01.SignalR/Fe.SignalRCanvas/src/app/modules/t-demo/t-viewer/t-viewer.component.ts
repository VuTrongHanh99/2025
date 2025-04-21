import { Component, OnInit } from '@angular/core';
import { TSignalingService } from 'src/app/services/t-signaling.service';

@Component({
  selector: 'app-t-viewer',
  templateUrl: './t-viewer.component.html',
  styleUrls: ['./t-viewer.component.scss']
})
export class TViewerComponent implements OnInit {

  constructor(private signaling: TSignalingService) { }

  ngOnInit(): void {
    const video = document.querySelector('video')!;
    this.signaling.startAsViewer(video);
  }

}
