import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from '../../services/data/data.service';

type Filter = 'All' | 'Birthday' | 'Anniversary';

@Component({
  selector: 'app-celebrations',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './celebrations.component.html',
})
export class CelebrationsComponent {
  private data = inject(DataService);
  filters: Filter[] = ['All', 'Birthday', 'Anniversary'];
  filter = signal<Filter>('All');

  all = this.data.celebrations(90);
  today = computed(() => this.all.filter((c) => c.daysAway === 0 && (this.filter() === 'All' || c.kind === this.filter())));
  later = computed(() => this.all.filter((c) => c.daysAway > 0 && (this.filter() === 'All' || c.kind === this.filter())));

  label = (f: Filter) => (f === 'All' ? 'All' : f === 'Birthday' ? 'Birthdays' : 'Work anniversaries');
  initials = (name: string) => name.split(' ').map((p) => p[0]).join('');
  when = (d: number) => (d === 1 ? 'Tomorrow' : `In ${d} days`);
}
