import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { CreateAccountComponent } from './features/auth/create-account/create-account.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './features/home/dashboard/dashboard.component';
import { TeamMembersComponent } from './features/team/team-members.component';
import { CelebrationsComponent } from './features/celebrations/celebrations.component';
import { HolidaysComponent } from './features/holidays/holidays.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'create-account', component: CreateAccountComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'team', component: TeamMembersComponent },
      { path: 'celebrations', component: CelebrationsComponent },
      { path: 'holidays', component: HolidaysComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
