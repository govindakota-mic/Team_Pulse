import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LinePoint {
  label: string;
  value: number;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements OnChanges {
  @Input() data: LinePoint[] = [];
  @Input() yMax = 4;
  @Input() yStep = 1;

  readonly width = 760;
  readonly height = 180;
  readonly padding = 8;

  linePath = '';
  areaPath = '';
  dots: { x: number; y: number }[] = [];
  yTicks: number[] = [];

  hoveredIndex: number | null = null;
  hoveredValueAnimated = 0;
  private animationInterval: any;

  ngOnChanges(): void {
    const ticks: number[] = [];
    for (let v = 0; v <= this.yMax; v += this.yStep) ticks.push(v);
    this.yTicks = ticks.reverse();

    if (!this.data.length) return;

    const usableW = this.width - this.padding * 2;
    const usableH = this.height - this.padding * 2;
    const stepX = usableW / (this.data.length - 1);

    this.dots = this.data.map((d, i) => ({
      x: this.padding + i * stepX,
      y: this.padding + usableH - (d.value / this.yMax) * usableH,
    }));

    this.linePath = this.dots
      .map(
        (p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
      )
      .join(' ');

    const baseline = this.padding + usableH;
    this.areaPath =
      `M ${this.dots[0].x.toFixed(1)} ${baseline} ` +
      this.dots.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
      ` L ${this.dots[this.dots.length - 1].x.toFixed(1)} ${baseline} Z`;
  }

  setHovered(index: number, point: LinePoint): void {
    this.hoveredIndex = index;
    this.animateValue(point.value);
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
