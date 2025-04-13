import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OcrService } from 'src/app/services/ocr.service';

@Component({
  selector: 'app-handwriting-canvas',
  templateUrl: './handwriting-canvas.component.html',
  styleUrls: ['./handwriting-canvas.component.scss']
})
export class HandwritingCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  penColor: string = '#000000';
  penWidth: number = 2;
  resultText: string = '#000000';

  constructor(public ocr: OcrService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.setupEvents(canvas);
  }
  setupEvents(canvas: HTMLCanvasElement) {
    // Mouse events
    canvas.addEventListener('mousedown', this.start.bind(this));
    canvas.addEventListener('mousemove', this.draw.bind(this));
    canvas.addEventListener('mouseup', this.stop.bind(this));
    canvas.addEventListener('mouseout', this.stop.bind(this));
    // Touch events for mobile
    canvas.addEventListener('touchstart', this.start.bind(this));
    canvas.addEventListener('touchmove', this.draw.bind(this));
    canvas.addEventListener('touchend', this.stop.bind(this));
  }
  private getEventPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    if (e instanceof MouseEvent) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    } else {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
  }

  start(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const pos = this.getEventPos(e);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.penWidth;
    this.ctx.lineCap = 'round';
    this.drawing = true;
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.drawing) return;
    e.preventDefault();
    const pos = this.getEventPos(e);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  stop(e: Event) {
    e.preventDefault();
    this.drawing = false;
    this.ctx.closePath();
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  saveCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'handwriting.png';
    link.click();
  }

  uploadCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const imageBase64 = canvas.toDataURL('image/png');
    // this.http.post('https://your-api-url.com/upload', {
    //   image: imageBase64
    // }).subscribe(
    //   res => {
    //     console.log('Tải ảnh lên thành công:', res);
    //     alert('Gửi ảnh thành công!');
    //   },
    //   err => {
    //     console.error('Lỗi khi tải ảnh:', err);
    //     alert('Gửi ảnh thất bại!');
    //   }
    // );
  }
  handleRecognize() {
    // const canvas = this.canvasRef.nativeElement;
    // const base64Image = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
    // this.ocr.detectText(base64Image).subscribe(res => {
    //   this.resultText = res.responses[0]?.fullTextAnnotation?.text || 'Không nhận diện được.';
    // });
  }
}
