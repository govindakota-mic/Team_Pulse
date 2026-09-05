import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DonutSegment {
  label: string;
  value: number;
  color: string; // hex
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donut-chart.component.html',
})
export class DonutChartComponent implements OnChanges {
  @Input() data: DonutSegment[] = [];

  gradient = '';
  total = 0;
  hoveredSegment: DonutSegment | null = null;
  animatedValue = 0;
  private animationInterval: any;

  ngOnChanges(): void {
    this.total = this.data.reduce((sum, d) => sum + d.value, 0);
    let cursor = 0;
    const stops: string[] = [];
    for (const d of this.data) {
      const start = (cursor / this.total) * 360;
      cursor += d.value;
      const end = (cursor / this.total) * 360;
      stops.push(`${d.color} ${start}deg ${end}deg`);
    }
    this.gradient = `conic-gradient(${stops.join(', ')})`;
    
    // Animate to total initially
    this.animateValue(this.total);
  }

  animateValue(target: number): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    const duration = 250; // ms
    const startTime = Date.now();
    const startValue = this.animatedValue;
    this.animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        this.animatedValue = target;
        clearInterval(this.animationInterval);
      } else {
        const progress = elapsed / duration;
        this.animatedValue = Math.round(startValue + (target - startValue) * progress);
      }
    }, 16);
  }

  setHovered(segment: DonutSegment): void {
    this.hoveredSegment = segment;
    this.animateValue(segment.value);
  }

  clearHovered(): void {
    this.hoveredSegment = null;
    this.animateValue(this.total);
  }
}
