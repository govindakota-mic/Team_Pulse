import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BarDatum {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html'
})
export class BarChartComponent implements OnChanges {
  @Input() data: BarDatum[] = [];
  @Input() yMax = 6;
  @Input() yStep = 2;

  yTicks: number[] = [];
  hoveredIndex: number | null = null;
  hoveredValueAnimated = 0;
  private animationInterval: any;

  ngOnChanges(): void {
    const ticks: number[] = [];
    for (let v = 0; v <= this.yMax; v += this.yStep) ticks.push(v);
    this.yTicks = ticks.reverse();
  }

  heightPct(value: number): number {
    return (value / this.yMax) * 100;
  }

  setHovered(index: number, bar: BarDatum): void {
    this.hoveredIndex = index;
    this.animateValue(bar.value);
  }

  clearHovered(): void {
    this.hoveredIndex = null;
    this.hoveredValueAnimated = 0;
  }

  animateValue(target: number): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    const duration = 200; // ms
    const startTime = Date.now();
    const startValue = 0;
    this.animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        this.hoveredValueAnimated = target;
        clearInterval(this.animationInterval);
      } else {
        const progress = elapsed / duration;
        this.hoveredValueAnimated = Math.round(startValue + target * progress);
      }
    }, 16);
  }
}
