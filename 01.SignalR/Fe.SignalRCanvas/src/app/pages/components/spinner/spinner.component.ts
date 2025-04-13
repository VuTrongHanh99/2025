
import { Component, OnInit } from '@angular/core';
import { SpinnerHandlerService } from 'src/app/spinner-handler.service';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  spinnerActive: boolean = true;
  constructor(public spinnerHandler: SpinnerHandlerService) {
    this.spinnerHandler.showSpinner.subscribe(this.showSpinner.bind(this));
  }
  ngOnInit(): void {
  }
  showSpinner = (state: boolean): void => {
    this.spinnerActive = state;
  };
}
