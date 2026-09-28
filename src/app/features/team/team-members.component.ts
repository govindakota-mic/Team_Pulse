import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DataService, parseDate } from '../../services/data/data.service';
import { SnackbarService } from '../../services/snack-bar/snack-bar.service';
import { Employee, LEVELS, Level } from '../../data/mock-data';
import { downloadPayslip } from '../../utils/payslip';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './team-members.component.html',
})
export class TeamMembersComponent {
  private data = inject(DataService);
  private snackbar = inject(SnackbarService);
  private fb = inject(FormBuilder);

  search = signal('');
  dept = signal('All');
  showForm = signal(false);
  levels = LEVELS;

  /** Default pay slip month: the previous month. */
  payMonth = signal(this.monthOf(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)));
  today = new Date().toISOString().slice(0, 10);

  total = computed(() => this.data.employees().length);
  departments = computed(() => ['All', ...new Set(this.data.employees().map((e) => e.department))]);
  deptOptions = computed(() => this.departments().slice(1));
  members = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.data.employees().filter(
      (e) => (this.dept() === 'All' || e.department === this.dept()) &&
        (!q || [e.name, e.role, e.email].some((f) => f.toLowerCase().includes(q))),
    );
  });

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email, (c: AbstractControl): ValidationErrors | null => (c.value && this.data.emailTaken(c.value) ? { taken: true } : null)]],
    department: ['', Validators.required],
    role: ['', Validators.required],
    level: ['Mid' as Level, Validators.required],
    dob: ['', Validators.required],
    joinDate: [new Date().toISOString().slice(0, 10), Validators.required],
    monthlySalary: [0, [Validators.required, Validators.min(1000)]],
  });

  initials = (name: string) => name.split(' ').map((p) => p[0]).join('');
  since = (iso: string) => parseDate(iso);

  private monthOf(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  @HostListener('window:keydown.escape')
  closeForm() {
    this.showForm.set(false);
  }

  openForm() {
    this.form.reset({ level: 'Mid', joinDate: this.today, monthlySalary: 0 });
    this.showForm.set(true);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const added = this.data.addEmployee({ ...v, name: v.name.trim(), email: v.email.trim().toLowerCase() });
    this.showForm.set(false);
    this.snackbar.success(`${added.name} added to the team.`);
  }

  async payslip(e: Employee) {
    const month = this.payMonth();
    if (!month) return this.snackbar.error('Choose a pay slip month first.');
    if (month < e.joinDate.slice(0, 7)) {
      return this.snackbar.error(`${e.name} joined in ${this.since(e.joinDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })}. Pick a later month.`);
    }
    try {
      await downloadPayslip(e, month);
    } catch {
      this.snackbar.error('Could not create the pay slip. Please try again.');
    }
  }

  invalid(name: string) {
    const c = this.form.get(name);
    return !!c && c.invalid && c.touched;
  }
}
