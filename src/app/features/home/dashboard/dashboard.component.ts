import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { DonutChartComponent, DonutSegment } from '../../../shared/components/donut-chart/donut-chart.component';
import { BarChartComponent, BarDatum } from '../../../shared/components/bar-chart/bar-chart.component';
import { LineChartComponent, LinePoint } from '../../../shared/components/line-chart/line-chart.component';
import { DataService, parseDate } from '../../../services/data/data.service';
import { LEVELS } from '../../../data/mock-data';

const COLORS = ['#6366F1', '#A78BFA', '#F0537D', '#F5A524', '#12B886', '#22C3E6', '#EF4444'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, StatCardComponent, DonutChartComponent, BarChartComponent, LineChartComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private data = inject(DataService);
  private emps = this.data.employees();

  stats = [
    { label: 'TOTAL PEOPLE', value: this.emps.length, icon: 'people' as const, iconBg: 'bg-indigo-500' },
    { label: 'ACTIVE', value: this.emps.filter((e) => e.active).length, icon: 'trend' as const, iconBg: 'bg-emerald-500' },
    { label: 'DEPARTMENTS', value: new Set(this.emps.map((e) => e.department)).size, icon: 'briefcase' as const, iconBg: 'bg-amber-500' },
    { label: 'PENDING LEAVES', value: this.data.pending().length, icon: 'award' as const, iconBg: 'bg-rose-500' },
  ];

  departmentData: DonutSegment[] = [...new Set(this.emps.map((e) => e.department))].map((label, i) => ({
    label, value: this.emps.filter((e) => e.department === label).length, color: COLORS[i % COLORS.length],
  }));

  roleLevelData: BarDatum[] = LEVELS.map((label, i) => ({
    label, value: this.emps.filter((e) => e.level === label).length, color: COLORS[i % COLORS.length],
  }));
  roleMax = Math.max(2, Math.ceil(Math.max(...this.roleLevelData.map((d) => d.value)) / 2) * 2);

  hiringGrowthData: LinePoint[] = (() => {
    const years = this.emps.map((e) => parseDate(e.joinDate).getFullYear());
    const from = Math.min(...years), to = Math.max(...years, new Date().getFullYear());
    return Array.from({ length: to - from + 1 }, (_, i) => ({
      label: String(from + i), value: years.filter((y) => y === from + i).length,
    }));
  })();
  hiringMax = Math.max(2, ...this.hiringGrowthData.map((d) => d.value));

  upcoming = this.data.celebrations(30).slice(0, 5);
}
