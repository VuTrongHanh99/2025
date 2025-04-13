import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SpinnerComponent } from './pages/components/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { HandwritingCanvasComponent } from './modules/handwriting-canvas/handwriting-canvas.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OcrService } from './services/ocr.service';
import { ScreenShareComponent } from './modules/screen-share/screen-share.component';
import { ViewerComponent } from './modules/viewer/viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    HandwritingCanvasComponent,
    ScreenShareComponent,
    ViewerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot(),
  ],
  providers: [
    HttpClientModule,
    OcrService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
