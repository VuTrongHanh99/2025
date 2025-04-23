import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SpinnerComponent } from './pages/components/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { HandwritingCanvasComponent } from './modules/draw-canvas/handwriting-canvas/handwriting-canvas.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OcrService } from './services/ocr.service';
import { ScreenShareComponent } from './modules/share-screen/screen-share/screen-share.component';
import { ViewerComponent } from './modules/share-screen/viewer/viewer.component';
import { DrawingCanvasComponent } from './modules/draw-canvas/drawing-canvas/drawing-canvas.component';
import { ScreenShare2Component } from './modules/share-screen/screen-share2/screen-share2.component';
import { N2viewerComponent } from './modules/share-screen/n2viewer/n2viewer.component';
import { N2broadcasterComponent } from './modules/share-screen/n2broadcaster/n2broadcaster.component';
import { KonvaPaintComponent } from './modules/paint/konva-paint/konva-paint.component';
import { NgxKonvaModule } from 'ngx-konva';
import { KonvaPaintMoreComponent } from './modules/paint/konva-paint-more/konva-paint-more.component';
import { KonvaDrawComponent } from './modules/paint/konva-draw/konva-draw.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    HandwritingCanvasComponent,
    ScreenShareComponent,
    ViewerComponent,
    DrawingCanvasComponent,
    ScreenShare2Component,
    N2viewerComponent,
    N2broadcasterComponent,
    KonvaPaintComponent,
    KonvaPaintMoreComponent,
    KonvaDrawComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxKonvaModule,
    TranslateModule.forRoot(),
  ],
  providers: [
    HttpClientModule,
    OcrService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
