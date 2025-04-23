import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HandwritingCanvasComponent } from './modules/draw-canvas/handwriting-canvas/handwriting-canvas.component';
import { ScreenShareComponent } from './modules/share-screen/screen-share/screen-share.component';
import { ViewerComponent } from './modules/share-screen/viewer/viewer.component';
import { DrawingCanvasComponent } from './modules/draw-canvas/drawing-canvas/drawing-canvas.component';
import { ScreenShare2Component } from './modules/share-screen/screen-share2/screen-share2.component';
import { N2broadcasterComponent } from './modules/share-screen/n2broadcaster/n2broadcaster.component';
import { N2viewerComponent } from './modules/share-screen/n2viewer/n2viewer.component';
import { THomeComponent } from './modules/t-demo/t-home/t-home.component';
import { TSenderComponent } from './modules/t-demo/t-sender/t-sender.component';
import { TViewerComponent } from './modules/t-demo/t-viewer/t-viewer.component';
import { KonvaPaintComponent } from './modules/paint/konva-paint/konva-paint.component';
import { KonvaPaintMoreComponent } from './modules/paint/konva-paint-more/konva-paint-more.component';
import { KonvaDrawComponent } from './modules/paint/konva-draw/konva-draw.component';
import { KonvaDrawAllComponent } from './modules/paint/konva-draw-all/konva-draw-all.component';

export const routes: Routes = [
  { path: '', redirectTo: 't-home', pathMatch: 'full' },
  { path: 't-home', component: THomeComponent },
  { path: 't-sender', component: TSenderComponent },
  { path: 't-viewer', component: TViewerComponent },
  {
    path: "drawingcanvas",
    component: DrawingCanvasComponent,
  },
  {
    path: "handwriting",
    component: HandwritingCanvasComponent,
  },
  {
    path: "screenshare",
    component: ScreenShareComponent,
  },
  {
    path: "screenshare2",
    component: ScreenShare2Component,
  },
  {
    path: "viewer",
    component: ViewerComponent,
  },
  //
  {
    path: "n2broadcaster",
    component: N2broadcasterComponent,
  },
  {
    path: "n2viewer",
    component: N2viewerComponent,
  },
  //paint
  {
    path: "konva-paint",
    component: KonvaPaintComponent,
  },
  {
    path: "konva-paint-more",
    component: KonvaPaintMoreComponent,
  },
  {
    path: "konva-draw",
    component: KonvaDrawComponent,
  },
  {
    path: "konva-draw-all",
    component: KonvaDrawAllComponent,
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
