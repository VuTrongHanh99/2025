import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  openWindows: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }
  openWindow(appName: string) {
    const id = Date.now();
    this.openWindows.push({ id, appName });
  }

  closeWindow(id: number) {
    this.openWindows = this.openWindows.filter(win => win.id !== id);
  }
}
