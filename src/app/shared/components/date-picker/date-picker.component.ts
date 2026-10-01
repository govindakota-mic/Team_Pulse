import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const pad = (n: number) => String(n).padStart(2, '0');
const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

interface DayCell { day: number; iso: string; disabled: boolean; }

/**
 * A styled calendar dropdown that replaces the native <input type="date">/<input type="month">.
 * Works both with reactive forms (formControlName) and plain [value]/(valueChange) binding.
 */
@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true }],
})
export class DatePickerComponent implements ControlValueAccessor {
  private el = inject(ElementRef<HTMLElement>);

  /** 'date' picks a single day (value 'YYYY-MM-DD'); 'month' picks a month (value 'YYYY-MM'). */
  @Input() mode: 'date' | 'month' = 'date';
  @Input() min?: string;
  @Input() max?: string;
  @Input() placeholder = 'Select date';
  /** Shows the red/invalid border; drive this from the host form's own validity check. */
  @Input() invalid = false;

  @Input() set value(v: string | null | undefined) {
    this._value.set(v || '');
    this.syncView();
  }
  get value(): string {
    return this._value();
  }
  @Output() valueChange = new EventEmitter<string>();

  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  readonly weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  private _value = signal('');
  open = signal(false);
  disabled = signal(false);
  viewYear = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth());
  /** true once we've measured that the popup would overflow the right edge of the viewport. */
  alignRight = signal(false);

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void {
    this._value.set(v || '');
    this.syncView();
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  private syncView() {
    const v = this._value();
    if (!v) return;
    const [y, m] = v.split('-').map(Number);
    this.viewYear.set(y);
    this.viewMonth.set((m || 1) - 1);
  }

  get display(): string {
    const v = this._value();
    if (!v) return '';
    if (this.mode === 'month') {
      const [y, m] = v.split('-').map(Number);
      return new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    const [y, m, d] = v.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  get headerLabel(): string {
    return this.mode === 'month' ? String(this.viewYear()) : `${this.months[this.viewMonth()]} ${this.viewYear()}`;
  }

  get grid(): (DayCell | null)[] {
    const y = this.viewYear(), m = this.viewMonth();
    const firstWeekday = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: (DayCell | null)[] = Array(firstWeekday).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toISODate(new Date(y, m, day));
      cells.push({ day, iso, disabled: this.outOfRange(iso) });
    }
    return cells;
  }

  toggle() {
    if (this.disabled()) return;
    const next = !this.open();
    this.open.set(next);
    if (next) {
      this.syncView();
      this.updateAlignment();
    }
  }

  /** Flips the popup to the left of the trigger when it would otherwise overflow the viewport's right edge. */
  private updateAlignment() {
    if (typeof window === 'undefined') return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const popupWidth = this.mode === 'month' ? 224 : 256;
    this.alignRight.set(rect.left + popupWidth + 12 > window.innerWidth);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (this.open() && !this.el.nativeElement.contains(e.target as Node)) {
      this.open.set(false);
      this.onTouched();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.open.set(false);
  }

  @HostListener('window:resize')
  onResize() {
    if (this.open()) this.updateAlignment();
  }

  prev() {
    if (this.mode === 'month') {
      this.viewYear.update((y) => y - 1);
    } else if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update((y) => y - 1);
    } else {
      this.viewMonth.update((m) => m - 1);
    }
  }

  next() {
    if (this.mode === 'month') {
      this.viewYear.update((y) => y + 1);
    } else if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update((y) => y + 1);
    } else {
      this.viewMonth.update((m) => m + 1);
    }
  }

  isSelected(iso: string) {
    return iso === this._value();
  }
  isToday(iso: string) {
    return iso === toISODate(new Date());
  }

  pick(cell: DayCell | null) {
    if (!cell || cell.disabled) return;
    this.commit(cell.iso);
  }

  monthValue(idx: number) {
    return `${this.viewYear()}-${pad(idx + 1)}`;
  }
  isMonthSelected(idx: number) {
    return this.monthValue(idx) === this._value();
  }
  monthDisabled(idx: number) {
    return this.outOfRange(this.monthValue(idx));
  }
  pickMonth(idx: number) {
    if (this.monthDisabled(idx)) return;
    this.commit(this.monthValue(idx));
  }

  private outOfRange(iso: string) {
    return (!!this.min && iso < this.min) || (!!this.max && iso > this.max);
  }

  private commit(iso: string) {
    this._value.set(iso);
    this.onChange(iso);
    this.onTouched();
    this.valueChange.emit(iso);
    this.open.set(false);
  }
}
