import { Component } from '@angular/core';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../../../services/snack-bar/snack-bar.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  passwordForm!: FormGroup;
  generatedOtp!: string;
  counter = 120;
  private timer: any;
  otpExpired = false;
  otpSent = false;

  constructor(
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private router: Router,
  ) {
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.counter / 60);
    const seconds = this.counter % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  startTimer() {
    // Validate email before sending OTP
    if (this.passwordForm.get('email')?.invalid) {
      this.snackbar.show('Please enter a valid email.');
      return;
    }

    // Call your Send OTP API here...
    const otp = Math.floor(1000 + Math.random() * 9000);
    this.snackbar.success(`OTP is ${otp}`);
    localStorage.setItem('otp', JSON.stringify(otp));

    this.otpSent = true;
    this.otpExpired = false;

    // Restart timer
    clearInterval(this.timer);
    this.counter = 120;

    this.timer = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        clearInterval(this.timer);
        this.otpExpired = true;
        this.snackbar.show('OTP has expired. Please request a new OTP.');
      }
    }, 1000);
  }

  resetPassword() {
    const otp = JSON.parse(localStorage.getItem('otp')!);
    if (this.passwordForm.value.otp == otp) {
      this.snackbar.success('Password changed successfully!');
      this.router.navigateByUrl('login');
    } else {
      this.snackbar.error('Incorrect OTP, Please try again !');
    }
  }
}
