import { Component } from '@angular/core';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snack-bar/snack-bar.service';
import {
  AuthService,
  RegisterRequest,
} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent {
  createForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: SnackbarService,
    private authService: AuthService,
  ) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  handleCreateAccount = () => {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const userData: RegisterRequest = {
      email: this.createForm.value.email,
      username: this.createForm.value.username,
      password: this.createForm.value.newPassword,
    };
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.snackbar.success('Account has been created successfully !');
        this.router.navigateByUrl('login');
      },
      error: (error) => {
        console.error('Registration Failed:', error);
        this.snackbar.error('Registration failed please try again !');
      },
    });
  };
}
