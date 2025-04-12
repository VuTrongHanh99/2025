import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
  @Input() window: any;
  @Output() close = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

}
