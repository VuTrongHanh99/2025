import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { THomeComponent } from './t-home/t-home.component';
import { TSenderComponent } from './t-sender/t-sender.component';
import { TViewerComponent } from './t-viewer/t-viewer.component';



@NgModule({
  declarations: [
    THomeComponent,
    TSenderComponent,
    TViewerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TDemoModule { }
