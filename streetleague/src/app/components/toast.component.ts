import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (toast of toasts(); track toast.id) {
        <div
          [ngClass]="{
            'bg-green-500': toast.type === 'success',
            'bg-red-500': toast.type === 'error',
            'bg-blue-500': toast.type === 'info'
          }"
          class="text-white px-6 py-3 rounded-lg shadow-lg animate-pulse"
        >
          {{ toast.message }}
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toasts = signal<Toast[]>([]);
  private toastId = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = this.toastId++;
    this.toasts.update(toasts => [...toasts, { id, message, type }]);

    setTimeout(() => {
      this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }, 3000);
  }
}
