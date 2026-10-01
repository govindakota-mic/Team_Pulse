import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { SnackbarService } from '../../../services/snack-bar/snack-bar.service';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { AuthService, LoginRequest } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, GoogleSigninButtonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user!: SocialUser;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private socail: SocialAuthService,
    private auth: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    this.socail.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.handleGoogleLogin(user);
      }
    });
  }

  onSubmitForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.auth.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.snackbar.success('Logged in successfully !');
        this.router.navigateByUrl('dashboard');
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.snackbar.error('Authentication Failed. Please try again!');
      },
    });
  }

  redirectToForgotPage() {
    this.router.navigateByUrl('forgot-password');
  }

  signWithGoogle(): void {
    this.socail.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  private handleGoogleLogin(user: SocialUser): void {
    // Store the Google user profile locally — no backend involved
    const googleUser = {
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      provider: 'google',
      id: user.id,
    };

    const authUsers = JSON.parse(localStorage.getItem('authUsers') || '[]');
    const exists = authUsers.some((u: any) => u.email === googleUser.email);
    if (!exists) {
      authUsers.push(googleUser);
      localStorage.setItem('authUsers', JSON.stringify(authUsers));
    }

    localStorage.setItem('currentUser', JSON.stringify(googleUser));
    this.auth.setSession(user.email);
    this.snackbar.success('Logged in successfully with Google!');
    this.router.navigate(['/dashboard']);
  }
}
