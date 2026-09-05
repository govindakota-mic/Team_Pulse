import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ], // <-- this line
})
export class FormFieldComponent {
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() id!: string;
}
