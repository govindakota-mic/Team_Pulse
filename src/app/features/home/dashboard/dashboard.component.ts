import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { DonutChartComponent, DonutSegment } from '../../../shared/components/donut-chart/donut-chart.component';
import { BarChartComponent, BarDatum } from '../../../shared/components/bar-chart/bar-chart.component';
import { LineChartComponent, LinePoint } from '../../../shared/components/line-chart/line-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    StatCardComponent,
    DonutChartComponent,
    BarChartComponent,
    LineChartComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  stats = [
    { label: 'TOTAL PEOPLE', value: 16, icon: 'people' as const, iconBg: 'bg-indigo-500' },
    { label: 'ACTIVE', value: 15, icon: 'trend' as const, iconBg: 'bg-emerald-500' },
    { label: 'DEPARTMENTS', value: 7, icon: 'briefcase' as const, iconBg: 'bg-amber-500' },
    { label: 'ROLES', value: 7, icon: 'award' as const, iconBg: 'bg-rose-500' }
  ];

  departmentData: DonutSegment[] = [
    { label: 'Engineering', value: 5, color: '#6366F1' },
    { label: 'Product', value: 2, color: '#A78BFA' },
    { label: 'Marketing', value: 2, color: '#F0537D' },
    { label: 'Finance', value: 2, color: '#F5A524' },
    { label: 'Design', value: 2, color: '#12B886' },
    { label: 'HR', value: 2, color: '#22C3E6' },
    { label: 'Sales', value: 1, color: '#EF4444' }
  ];

  roleLevelData: BarDatum[] = [
    { label: 'Mid', value: 5, color: '#6366F1' },
    { label: 'Lead', value: 2, color: '#A78BFA' },
    { label: 'Junior', value: 3, color: '#F0537D' },
    { label: 'Senior', value: 3, color: '#F5A524' },
    { label: 'Intern', value: 1, color: '#12B886' },
    { label: 'Manager', value: 2, color: '#22C3E6' },
    { label: 'Director', value: 1, color: '#F5679E' }
  ];

  hiringGrowthData: LinePoint[] = [
    { label: '2015', value: 0 },
    { label: '2016', value: 0 },
    { label: '2017', value: 0 },
    { label: '2018', value: 0 },
    { label: '2019', value: 0 },
    { label: '2020', value: 0 },
    { label: '2021', value: 1.5 },
    { label: '2022', value: 3.4 },
    { label: '2023', value: 0.4 },
    { label: '2024', value: 2.4 },
    { label: '2025', value: 0.3 }
  ];
}
