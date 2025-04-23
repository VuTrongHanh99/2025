import { Component } from '@angular/core';
import Konva from 'konva';

@Component({
    selector: 'app-konva-paint',
    templateUrl: './konva-paint.component.html',
    styleUrls: ['./konva-paint.component.scss']
})
export class KonvaPaintComponent {
    stage: Konva.Stage = null as any;
    layer: Konva.Layer = null as any;
    isDrawing = false;
    mode: 'draw' | 'rect' | 'circle' | 'text' | 'erase' = 'draw';
    color = '#000000';
    lineWidth = 2;
    history: string[] = [];
    redoStack: string[] = [];

    ngOnInit() {
        this.stage = new Konva.Stage({
            container: 'canvas-container',
            width: 800,
            height: 600
        });

        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.setupDrawEvents();
    }

    setupDrawEvents() {
        let lastLine: Konva.Line;

        this.stage.on('mousedown touchstart', (e) => {
            if (this.mode === 'draw' || this.mode === 'erase') {
                this.isDrawing = true;
                const pos = this.stage.getPointerPosition();
                lastLine = new Konva.Line({
                    stroke: this.mode === 'erase' ? '#ffffff' : this.color,
                    strokeWidth: this.lineWidth,
                    globalCompositeOperation: this.mode === 'erase' ? 'destination-out' : 'source-over',
                    points: [pos!.x, pos!.y],
                    lineCap: 'round',
                    lineJoin: 'round'
                });
                this.layer.add(lastLine);
            }
        });

        this.stage.on('mouseup touchend', () => {
            this.isDrawing = false;
            this.saveHistory();
        });

        this.stage.on('mousemove touchmove', () => {
            if (!this.isDrawing || !lastLine) return;
            const pos = this.stage.getPointerPosition();
            const newPoints = lastLine.points().concat([pos!.x, pos!.y]);
            lastLine.points(newPoints);
            this.layer.batchDraw();
        });
    }

    drawRect() {
        const rect = new Konva.Rect({
            x: 100,
            y: 100,
            width: 150,
            height: 100,
            fill: this.color,
            draggable: true
        });
        this.layer.add(rect);
        this.layer.draw();
        this.saveHistory();
    }

    drawCircle() {
        const circle = new Konva.Circle({
            x: 200,
            y: 200,
            radius: 50,
            fill: this.color,
            draggable: true
        });
        this.layer.add(circle);
        this.layer.draw();
        this.saveHistory();
    }

    addText() {
        const text = new Konva.Text({
            x: 250,
            y: 250,
            text: 'Hello Konva!',
            fontSize: 24,
            fill: this.color,
            draggable: true
        });
        this.layer.add(text);
        this.layer.draw();
        this.saveHistory();
    }

    undo() {
        const json = this.history.pop();
        if (!json) return;
        this.redoStack.push(this.stage.toJSON());
        this.stage.destroyChildren();
        this.stage = Konva.Node.create(json, 'canvas-container');
        this.layer = this.stage.findOne('Layer')!;
        this.setupDrawEvents();
    }

    redo() {
        const json = this.redoStack.pop();
        if (!json) return;
        this.history.push(this.stage.toJSON());
        this.stage.destroyChildren();
        this.stage = Konva.Node.create(json, 'canvas-container');
        this.layer = this.stage.findOne('Layer')!;
        this.setupDrawEvents();
    }

    saveHistory() {
        this.history.push(this.stage.toJSON());
        this.redoStack = [];
    }

    exportImage() {
        const dataURL = this.stage.toDataURL();
        const link = document.createElement('a');
        link.download = 'canvas.png';
        link.href = dataURL;
        link.click();
    }
}
