import { Injectable, computed, signal } from '@angular/core';
import { EMPLOYEES, Employee, HOLIDAYS, LEAVES, LeaveRequest, LeaveStatus, LeaveType } from '../../data/mock-data';

export interface Celebration {
  employee: Employee; kind: 'Birthday' | 'Anniversary'; date: Date; daysAway: number; years: number;
}

export const parseDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly currentUserId = 1; // Priya Sharma: applies for leave and approves others'
  readonly quota: Record<LeaveType, number> = { Casual: 12, Sick: 10, Earned: 15 };
  readonly holidays = HOLIDAYS;

  employees = signal<Employee[]>(EMPLOYEES);
  leaves = signal<LeaveRequest[]>(LEAVES);

  pending = computed(() => this.leaves().filter((l) => l.status === 'Pending' && l.empId !== this.currentUserId));
  myLeaves = computed(() => this.leaves().filter((l) => l.empId === this.currentUserId).sort((a, b) => b.id - a.id));

  emailTaken(email: string) {
    return this.employees().some((e) => e.email.toLowerCase() === email.trim().toLowerCase());
  }

  addEmployee(input: Omit<Employee, 'id' | 'active'>): Employee {
    const employee: Employee = { ...input, id: Math.max(0, ...this.employees().map((e) => e.id)) + 1, active: true };
    this.employees.update((list) => [employee, ...list]);
    return employee;
  }

  employee(id: number) {
    return this.employees().find((e) => e.id === id);
  }

  remaining(type: LeaveType): number {
    const used = this.myLeaves().filter((l) => l.type === type && l.status !== 'Rejected').reduce((s, l) => s + l.days, 0);
    return this.quota[type] - used;
  }

  /** Weekdays between two ISO dates, inclusive. */
  weekdays(from: string, to: string): number {
    let n = 0;
    for (let d = parseDate(from); d <= parseDate(to); d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) n++;
    }
    return n;
  }

  applyLeave(type: LeaveType, from: string, to: string, reason: string): string | null {
    const days = this.weekdays(from, to);
    if (days < 1) return 'Pick at least one working day.';
    if (days > this.remaining(type)) return `Only ${this.remaining(type)} ${type} leave days left.`;
    const id = Math.max(0, ...this.leaves().map((l) => l.id)) + 1;
    const appliedOn = new Date().toISOString().slice(0, 10);
    this.leaves.update((list) => [...list, { id, empId: this.currentUserId, type, from, to, days, reason, status: 'Pending', appliedOn }]);
    return null;
  }

  decide(id: number, status: LeaveStatus) {
    this.leaves.update((list) => list.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  celebrations(withinDays = 90): Celebration[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const out: Celebration[] = [];
    for (const employee of this.employees().filter((e) => e.active)) {
      for (const [kind, iso] of [['Birthday', employee.dob], ['Anniversary', employee.joinDate]] as const) {
        const src = parseDate(iso);
        const date = new Date(today.getFullYear(), src.getMonth(), src.getDate());
        if (date < today) date.setFullYear(date.getFullYear() + 1);
        const daysAway = Math.round((date.getTime() - today.getTime()) / 864e5);
        const years = date.getFullYear() - src.getFullYear();
        if (daysAway <= withinDays && (kind === 'Birthday' || years > 0)) out.push({ employee, kind, date, daysAway, years });
      }
    }
    return out.sort((a, b) => a.daysAway - b.daysAway);
  }
}
