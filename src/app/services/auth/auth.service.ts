import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';

export interface RegisterRequest { username: string; email: string; password: string; }
export interface RegisterResponse { message: string; user: { id: number; username: string; email: string } }
export interface LoginRequest { email: string; password: string; }
export interface AuthResponse { message: string; user: { id: number; email: string } }

/** Static demo auth (no backend). Replace the bodies with HttpClient calls later. */
export const DEMO_USER = { email: 'admin@teampulse.com', password: 'admin123' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private read<T>(key: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; }
  }

  register(user: RegisterRequest): Observable<RegisterResponse> {
    const users = this.read<RegisterRequest[]>('tp_users', []);
    if (user.email === DEMO_USER.email || users.some((u) => u.email === user.email)) {
      return throwError(() => new Error('Email already registered'));
    }
    if (this.isBrowser) localStorage.setItem('tp_users', JSON.stringify([...users, user]));
    return of({ message: 'Registered', user: { id: users.length + 2, username: user.username, email: user.email } });
  }

  login(user: LoginRequest): Observable<AuthResponse> {
    const users = this.read<RegisterRequest[]>('tp_users', []);
    const ok = (user.email === DEMO_USER.email && user.password === DEMO_USER.password)
      || users.some((u) => u.email === user.email && u.password === user.password);
    if (!ok) return throwError(() => new Error('Invalid credentials'));
    this.setSession(user.email);
    return of({ message: 'Logged in', user: { id: 1, email: user.email } });
  }

  logout(): Observable<{ message: string }> {
    if (this.isBrowser) localStorage.removeItem('tp_session');
    return of({ message: 'Logged out' });
  }

  setSession(email: string) {
    if (this.isBrowser) localStorage.setItem('tp_session', email);
  }

  isLoggedIn(): boolean {
    return this.isBrowser ? !!localStorage.getItem('tp_session') : true; // server render is not gated
  }
}
