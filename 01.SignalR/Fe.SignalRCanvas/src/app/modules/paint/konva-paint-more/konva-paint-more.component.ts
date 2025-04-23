import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import { Shape, ShapeConfig } from 'konva/lib/Shape';

@Component({
  selector: 'app-konva-paint-more',
  templateUrl: './konva-paint-more.component.html',
  styleUrls: ['./konva-paint-more.component.scss']
})
export class KonvaPaintMoreComponent {
  strokeColor = '#000';
  fontSize = 24;
  fontFamily = 'Arial';

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  drawing: boolean = false;
  currentShape: string = 'freeDraw';
  shapes: Konva.Shape[] = [];
  history: any[] = [];
  redoStack: Konva.Shape[][] = [];

  constructor() { }

  ngOnInit() {
    this.initCanvas();
  }

  initCanvas() {
    this.stage = new Konva.Stage({
      container: 'canvas-container',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.addEventListeners();
  }
  addEventListeners() {
    let lastLine: Konva.Line;
    this.stage.on('mousedown touchstart', (e) => {
      if (this.currentShape === 'freeDraw') {
        this.drawing = true;
        const pos = this.stage.getPointerPosition();
        if (pos == null) return;
        lastLine = new Konva.Line({
          points: [pos.x, pos.y],
          stroke: this.strokeColor,
          strokeWidth: 5,
          lineCap: 'round',
          lineJoin: 'round',
        });
        this.layer.add(lastLine);
        this.shapes.push(lastLine);
      }
    });

    this.stage.on('mouseup touchend', () => {
      this.drawing = false;
      this.saveState();
    });

    this.stage.on('mousemove touchmove', (e) => {
      if (!this.drawing || !lastLine) return;
      const pos = this.stage.getPointerPosition();
      if (pos == null) return;
      const newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
      this.layer.batchDraw();
      // const pos = this.stage.getPointerPosition();
      // if (pos == null)
      //   return;
      // const line = this.shapes[this.shapes.length - 1] as Konva.Line;
      // line.points(line.points().concat([pos.x, pos.y]));
      // this.layer.batchDraw();
    });
  }

  saveState() {
    // Clone các đối tượng của layer để tránh việc thay đổi sau này
    const state = this.layer.getChildren().map(node => node.clone());
    this.history.push(state);
    this.redoStack = []; // Clear redo stack after a new action
  }

  undo() {
    if (this.history.length > 0) {
      const lastState = this.history.pop() as Shape<ShapeConfig>[];
      this.redoStack.push(lastState);
      this.layer.removeChildren();
      this.layer.add(...lastState);
      this.layer.batchDraw();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const lastState = this.redoStack.pop() as Shape<ShapeConfig>[];
      this.history.push(lastState);
      this.layer.removeChildren();
      this.layer.add(...lastState);
      this.layer.batchDraw();
    }
  }

  clearCanvas() {
    this.layer.removeChildren();
    this.layer.batchDraw();
  }

  setShape(type: string) {
    this.currentShape = type;
  }

  addRectangle() {
    const rect = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: 'red',
      draggable: true,
    });
    this.layer.add(rect);
    this.shapes.push(rect);
    this.saveState();
  }

  addCircle() {
    const circle = new Konva.Circle({
      x: 150,
      y: 150,
      radius: 50,
      fill: 'green',
      draggable: true,
    });
    this.layer.add(circle);
    this.shapes.push(circle);
    this.saveState();
  }

  addText() {
    const text = new Konva.Text({
      x: 200,
      y: 200,
      text: 'Hello!',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'blue',
      draggable: true,
    });
    this.layer.add(text);
    this.shapes.push(text);
    this.saveState();
  }
}
