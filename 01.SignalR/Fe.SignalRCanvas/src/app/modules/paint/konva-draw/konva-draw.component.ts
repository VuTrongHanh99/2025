import { Component } from '@angular/core';
import Konva from 'konva';
@Component({
  selector: 'app-konva-draw',
  templateUrl: './konva-draw.component.html',
  styleUrls: ['./konva-draw.component.scss']
})
export class KonvaDrawComponent {
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  strokeColor = '#000';
  fontSize = 24;
  fontFamily = 'Arial';
  tool = 'pen';
  shapes: any[] = [];
  history: any[][] = [];
  redoStack: any[][] = [];
  currentLine: any;

  stageConfig = { width: 800, height: 600 };

  constructor() { }

  ngOnInit() {
    this.stage = new Konva.Stage({
      container: 'canvas-container', // ID của div chứa canvas
      width: this.stageConfig.width,
      height: this.stageConfig.height,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  selectTool(tool: string) {
    this.tool = tool;
  }

  // Mouse Down Event - Start drawing
  onStageMouseDown(event: any) {
    const stage = this.stage;
    const pos = stage.getPointerPosition();
    if (pos == null)
      return;
    if (this.tool === 'pen') {
      this.currentLine = new Konva.Line({
        points: [pos.x, pos.y],
        stroke: this.strokeColor,
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round',
        draggable: true,
      });

      this.layer.add(this.currentLine);
      this.shapes.push({ type: 'pen', config: this.currentLine });
    } else if (this.tool === 'rect') {
      const shape = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 100,
        height: 50,
        stroke: this.strokeColor,
        draggable: true,
      });

      this.layer.add(shape);
      this.shapes.push({ type: 'rect', config: shape });
    } else if (this.tool === 'circle') {
      const shape = new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: 40,
        stroke: this.strokeColor,
        draggable: true,
      });

      this.layer.add(shape);
      this.shapes.push({ type: 'circle', config: shape });
    } else if (this.tool === 'text') {
      const shape = new Konva.Text({
        x: pos.x,
        y: pos.y,
        text: 'Type here',
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        fill: this.strokeColor,
        draggable: true,
      });

      this.layer.add(shape);
      this.shapes.push({ type: 'text', config: shape });
    } else if (this.tool === 'eraser') {
      this.shapes.forEach((s) => {
        const konvaClassMap: { [key: string]: any } = {
          pen: Konva.Line,
          rect: Konva.Rect,
          circle: Konva.Circle,
          text: Konva.Text,
        };

        const ShapeClass = konvaClassMap[s.type];
        if (!ShapeClass) return;

        const shapeNode = new ShapeClass(s.config);
        if (shapeNode.intersects({ x: pos.x, y: pos.y })) {
          shapeNode.destroy();
          this.shapes = this.shapes.filter((item) => item !== s);
        }
      });
    }

    this.layer.batchDraw();
    this.saveHistory();
  }

  // Mouse Move Event - Update drawing (pen tool)
  onStageMouseMove(event: any) {
    if (!this.currentLine || this.tool !== 'pen') return;

    const pos = event.target.getStage().getPointerPosition();
    this.currentLine.points(this.currentLine.points().concat([pos.x, pos.y]));
    this.layer.batchDraw();
  }

  // Mouse Up Event - End drawing (pen tool)
  onStageMouseUp() {
    this.currentLine = null;
  }

  // Text Drag End Event
  onTextDragEnd(shape: any) {
    this.saveHistory();
  }

  // Undo Function
  undo() {
    if (this.history.length > 1) {
      this.redoStack.push(this.history.pop()!);
      this.shapes = JSON.parse(JSON.stringify(this.history[this.history.length - 1]));
      this.redrawShapes();
    }
  }

  // Redo Function
  redo() {
    if (this.redoStack.length > 0) {
      const redoState = this.redoStack.pop()!;
      this.shapes = JSON.parse(JSON.stringify(redoState));
      this.history.push(redoState);
      this.redrawShapes();
    }
  }

  // Save history for undo/redo
  saveHistory() {
    this.history.push(JSON.parse(JSON.stringify(this.shapes)));
    this.redoStack = [];
  }

  // Redraw all shapes on layer
  redrawShapes() {
    this.layer.removeChildren();
    this.shapes.forEach((shape) => {
      const ShapeClass = this.getShapeClass(shape.type);
      const newShape = new ShapeClass(shape.config);
      this.layer.add(newShape);
    });
    this.layer.batchDraw();
  }

  // Get the Konva class based on shape type
  getShapeClass(type: string) {
    const shapeClassMap: { [key: string]: any } = {
      pen: Konva.Line,
      rect: Konva.Rect,
      circle: Konva.Circle,
      text: Konva.Text,
    };
    return shapeClassMap[type];
  }
}
