import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STATUS_COLORS, TYPE_COLORS } from '../utils/constants';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="['px-3', 'py-1', 'rounded-full', 'text-white', 'text-sm', 'font-semibold', colorClass()]">
      {{ label() }}
    </span>
  `
})
export class BadgeComponent {
  label = input.required<string>();
  type = input<'status' | 'type'>('status');

  colorClass() {
    const colors = this.type() === 'status' ? STATUS_COLORS : TYPE_COLORS;
    const key = this.label() as keyof typeof colors;
    return colors[key] || 'bg-gray-500';
  }
}
