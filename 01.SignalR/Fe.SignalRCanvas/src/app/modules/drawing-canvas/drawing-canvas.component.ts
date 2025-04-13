import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drawing-canvas',
  templateUrl: './drawing-canvas.component.html',
  styleUrls: ['./drawing-canvas.component.scss']
})
export class DrawingCanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  strokeColor = '#000000';
  lineWidth = 5;
  drawing = false;
  tool: 'pen' | 'eraser' | 'text' | 'rect' | 'circle' = 'pen';

  startX = 0;
  startY = 0;

  history: string[] = [];
  redoStack: string[] = [];

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.saveHistory();
  }

  selectTool(tool: any) {
    this.tool = tool;
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.tool = 'eraser';
  }

  startDrawing(event: MouseEvent) {
    const { offsetX, offsetY } = event;
    this.startX = offsetX;
    this.startY = offsetY;
    this.drawing = true;

    if (this.tool === 'text') {
      const text = prompt('Nhập chữ:');
      if (text) {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = this.strokeColor;
        this.ctx.fillText(text, offsetX, offsetY);
        this.saveHistory();
      }
      this.drawing = false;
    }
  }

  draw(event: MouseEvent) {
    if (!this.drawing) return;

    const { offsetX, offsetY } = event;

    if (this.tool === 'pen' || this.tool === 'eraser') {
      this.ctx.strokeStyle = this.tool === 'eraser' ? 'white' : this.strokeColor;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
      this.startX = offsetX;
      this.startY = offsetY;
    }
  }

  stopDrawing(event: MouseEvent) {
    if (!this.drawing) return;
    this.drawing = false;

    const { offsetX, offsetY } = event;

    if (this.tool === 'rect') {
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.strokeRect(this.startX, this.startY, offsetX - this.startX, offsetY - this.startY);
    }

    if (this.tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(offsetX - this.startX, 2) + Math.pow(offsetY - this.startY, 2)
      );
      this.ctx.beginPath();
      this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.stroke();
    }

    this.saveHistory();
  }

  saveHistory() {
    const data = this.canvasRef.nativeElement.toDataURL();
    this.history.push(data);
    this.redoStack = [];
  }

  undo() {
    if (this.history.length > 1) {
      const last = this.history.pop()!;
      this.redoStack.push(last);
      this.restore(this.history[this.history.length - 1]);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const redoImg = this.redoStack.pop()!;
      this.history.push(redoImg);
      this.restore(redoImg);
    }
  }

  restore(dataUrl: string) {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      this.ctx.clearRect(0, 0, 800, 500);
      this.ctx.drawImage(img, 0, 0);
    };
  }
}