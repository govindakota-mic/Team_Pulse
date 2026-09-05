import { Injectable, signal } from '@angular/core';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarMessage {
  id: number;
  text: string;
  type: SnackbarType;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private counter = 0;
  messages = signal<SnackbarMessage[]>([]);

  show(text: string, type: SnackbarType = 'info', duration = 3000) {
    const id = this.counter++;
    this.messages.update((list) => [...list, { id, text, type }]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(text: string, duration?: number) {
    this.show(text, 'success', duration);
  }

  error(text: string, duration?: number) {
    this.show(text, 'error', duration);
  }

  dismiss(id: number) {
    this.messages.update((list) => list.filter((m) => m.id !== id));
  }
}
