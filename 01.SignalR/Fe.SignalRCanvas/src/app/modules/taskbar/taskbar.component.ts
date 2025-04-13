import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss']
})
export class TaskbarComponent implements OnInit {
  currentTime: string = '';
  constructor() { }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }
  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }
}
