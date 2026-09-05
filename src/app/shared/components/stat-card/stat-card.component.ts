import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: number | string = '';
  @Input() icon: 'people' | 'trend' | 'briefcase' | 'award' = 'people';
  @Input() iconBg = 'bg-indigo-500';
}
