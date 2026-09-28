import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, parseDate } from '../../services/data/data.service';
import { SnackbarService } from '../../services/snack-bar/snack-bar.service';
import { LeaveType } from '../../data/mock-data';

type Tab = 'holidays' | 'my' | 'approvals';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './holidays.component.html',
})
export class HolidaysComponent {
  data = inject(DataService);
  private snackbar = inject(SnackbarService);
  private fb = inject(FormBuilder);

  tab = signal<Tab>('holidays');
  types: LeaveType[] = ['Casual', 'Sick', 'Earned'];
  today = new Date().toISOString().slice(0, 10);

  form = this.fb.nonNullable.group({
    type: ['Casual' as LeaveType, Validators.required],
    from: ['', Validators.required],
    to: ['', Validators.required],
    reason: ['', [Validators.required, Validators.minLength(3)]],
  });

  d = parseDate;
  name = (id: number) => this.data.employee(id)?.name ?? 'Unknown';
  isPast = (iso: string) => parseDate(iso) < new Date(new Date().setHours(0, 0, 0, 0));
  nextHoliday = this.data.holidays.find((h) => !this.isPast(h.date));
  pill = (s: string) =>
    s === 'Approved' ? 'bg-emerald-50 text-emerald-600' : s === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600';

  apply() {
    const { type, from, to, reason } = this.form.getRawValue();
    if (this.form.invalid || to < from) {
      this.form.markAllAsTouched();
      this.snackbar.error(to < from ? 'End date is before the start date.' : 'Fill in every field to apply.');
      return;
    }
    const error = this.data.applyLeave(type, from, to, reason);
    if (error) return this.snackbar.error(error);
    this.snackbar.success('Leave request sent for approval.');
    this.form.reset({ type: 'Casual', from: '', to: '', reason: '' });
  }

  decide(id: number, status: 'Approved' | 'Rejected') {
    this.data.decide(id, status);
    this.snackbar.success(`Leave ${status.toLowerCase()}.`);
  }
}
