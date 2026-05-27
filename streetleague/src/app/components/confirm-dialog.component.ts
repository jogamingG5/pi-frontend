import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay">
        <div class="modal" style="max-width: 400px;">
          <h2 style="color: #00d4ff; margin-bottom: 1rem;">{{ title() }}</h2>
          <p style="color: #b0c4de; margin-bottom: 2rem;">{{ message() }}</p>
          <div class="button-group">
            <button
              (click)="onCancel()"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button
              (click)="onConfirm()"
              class="btn-danger"
            >
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class ConfirmDialogComponent {
  isOpen = input(false);
  title = input('Confirm Action');
  message = input('Are you sure?');
  confirmText = input('Delete');
  
  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
