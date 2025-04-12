import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesktopComponent } from './modules/desktop/desktop.component';
import { TaskbarComponent } from './modules/taskbar/taskbar.component';
import { WindowComponent } from './modules/window/window.component';
import { HandwritingCanvasComponent } from './modules/handwriting-canvas/handwriting-canvas.component';
import { ScreenShareComponent } from './modules/screen-share/screen-share.component';
import { ViewerComponent } from './modules/viewer/viewer.component';

export const routes: Routes = [
  {
    path: "desktop",
    component: DesktopComponent,
  },
  {
    path: "task",
    component: TaskbarComponent,
  },
  {
    path: "window",
    component: WindowComponent,
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
    path: "viewer",
    component: ViewerComponent,
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
