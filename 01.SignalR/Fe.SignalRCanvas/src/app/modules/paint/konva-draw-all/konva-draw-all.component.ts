import { Component, ViewChild } from '@angular/core';
import { KoShapeComponent, KoStageComponent } from 'ngx-konva';  // Import KonvaComponent từ ngx-konva
import Konva from 'konva';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-konva-draw-all',
  templateUrl: './konva-draw-all.component.html',
  styleUrls: ['./konva-draw-all.component.scss']
})
export class KonvaDrawAllComponent {
  stageConfig = { width: 800, height: 600 };
  @ViewChild('stageComp') stageComp!: KoStageComponent;
  stage!: Konva.Stage;
  layerMap: Record<string, Konva.Layer> = {};

  activeTool: 'select' | 'freeDraw' | 'shape' | 'text' | 'eraser' = 'select';
  shapeType = 'rect';
  textOptions = { text: 'Sample', fontSize: 24, fontFamily: 'Arial', fill: '#000000' };
  bgColor = '#ffffff';

  constructor(private history: HistoryService) { }

  ngAfterViewInit() {
    this.stage = this.stageComp.stage;
    this.createLayer('main');
    this.history.capture(this.stage.toJSON());

    this.stage.on('contentContextmenu', e => {
      e.evt.preventDefault();
      if (this.activeTool === 'eraser') {
        this.eraseAt(e.evt);
      }
    });

    this.startFreeDraw();
  }

  private createLayer(name: string) {
    const layer = new Konva.Layer();
    this.stage.add(layer);
    this.layerMap[name] = layer;
  }

  selectTool(tool: typeof this.activeTool) {
    this.activeTool = tool;
  }

  private startFreeDraw() {
    let isDrawing = false;
    let line: Konva.Line;
    const layer = this.layerMap['main'];

    this.stage.on('mousedown touchstart', () => {
      if (this.activeTool !== 'freeDraw') return;
      isDrawing = true;
      const pos = this.stage.getPointerPosition();
      if (pos == null) return;
      line = new Konva.Line({
        stroke: this.bgColor,
        strokeWidth: 2,
        globalCompositeOperation: 'source-over',
        points: [pos.x, pos.y]
      });
      layer.add(line);
    });
    this.stage.on('mouseup touchend', () => {
      if (isDrawing) {
        isDrawing = false;
        this.history.capture(this.stage.toJSON());
      }
    });
    this.stage.on('mousemove touchmove', () => {
      if (!isDrawing) return;
      const pos = this.stage.getPointerPosition();
      if (pos == null) return;
      line.points(line.points().concat([pos.x, pos.y]));
      layer.batchDraw();
    });
  }

  addShape() {
    const layer = this.layerMap['main'];
    let shape: Konva.Shape;
    const common = { draggable: true, fill: '#00D2FF', stroke: '#000', strokeWidth: 1 };

    switch (this.shapeType) {
      case 'rect':
        shape = new Konva.Rect({ x: 50, y: 50, width: 100, height: 60, ...common });
        break;
      case 'circle':
        shape = new Konva.Circle({ x: 150, y: 150, radius: 50, ...common });
        break;
      case 'line':
        shape = new Konva.Line({ points: [200, 200, 300, 300], stroke: '#000', strokeWidth: 2, draggable: true });
        break;
      case 'triangle':
        shape = new Konva.RegularPolygon({ x: 300, y: 100, sides: 3, radius: 60, ...common });
        break;
      default:
        return;
    }

    layer.add(shape);
    const tr = new Konva.Transformer({ rotateEnabled: true });
    layer.add(tr);
    tr.attachTo(shape);
    layer.draw();

    this.history.capture(this.stage.toJSON());
  }

  addText() {
    const layer = this.layerMap['main'];
    const txt = new Konva.Text({
      ...this.textOptions,
      x: 70,
      y: 200,
      draggable: true
    });
    layer.add(txt);
    const tr = new Konva.Transformer();
    layer.add(tr);
    tr.attachTo(txt);
    layer.draw();

    this.history.capture(this.stage.toJSON());
  }

  eraseAt(evt: MouseEvent) {
    const pos = this.stage.getPointerPosition()!;
    const shape = this.stage.getIntersection(pos);
    if (shape) {
      shape.destroy();
      this.layerMap['main'].batchDraw();
      this.history.capture(this.stage.toJSON());
    }
  }

  undo() {
    const state = this.history.undo();
    if (state) {
      this.stage.destroyChildren();
      Konva.Node.create(state, this.stage.container());
      this.stage.draw();
    }
  }

  redo() {
    const state = this.history.redo();
    if (state) {
      this.stage.destroyChildren();
      Konva.Node.create(state, this.stage.container());
      this.stage.draw();
    }
  }

  deleteSelected() {
    // Lấy tất cả transformer và ép kiểu về Konva.Transformer[]
    const transformers = this.stage.find('Transformer') as Konva.Transformer[];
    transformers.forEach(t => {
      if (t instanceof Konva.Transformer) {
        const nodes = t.nodes();
        nodes.forEach(n => n.destroy());
        t.destroy();
      }
    });
    this.layerMap['main'].draw();
    this.history.capture(this.stage.toJSON());
  }

  saveImage() {
    // Export stage as PNG; remove 'bgcolor' (unsupported option)
    const dataURL = this.stage.toDataURL({
      pixelRatio: 2,
      mimeType: 'image/png'
    });
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = dataURL;
    link.click();
  }
}
