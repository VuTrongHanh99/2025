import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HistoryService {
    private history: string[] = [];
    private pointer = -1;

    /**
     * Capture a new state (Konva stage JSON)
     */
    capture(state: string) {
        // If we've undone some actions, drop future states
        if (this.pointer < this.history.length - 1) {
            this.history.splice(this.pointer + 1);
        }
        this.history.push(state);
        this.pointer = this.history.length - 1;
    }

    /**
     * Undo to previous state
     * @returns JSON string or null if not available
     */
    undo(): string | null {
        if (this.pointer > 0) {
            this.pointer--;
            return this.history[this.pointer];
        }
        return null;
    }

    /**
     * Redo to next state
     * @returns JSON string or null if not available
     */
    redo(): string | null {
        if (this.pointer < this.history.length - 1) {
            this.pointer++;
            return this.history[this.pointer];
        }
        return null;
    }
}