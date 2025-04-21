import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-t-home',
  templateUrl: './t-home.component.html',
  styleUrls: ['./t-home.component.scss']
})
export class THomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  go(role: 't-sender' | 't-viewer') {
    this.router.navigate([`/${role}`]);
  }
}
