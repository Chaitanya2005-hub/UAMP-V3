import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { InactivityService } from './inactivity.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private inactivityService = inject(InactivityService);
  
  currentUser = signal<User | null>(null);
  token = signal<string | null>(localStorage.getItem('uamp_token'));
  inactivityNotice = signal<string | null>(null);

  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);

  constructor(private http: HttpClient, private router: Router) {
    if (this.token()) {
      this.loadCurrentUser().subscribe();
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.token.set(res.token);
        localStorage.setItem('uamp_token', res.token);
        this.currentUser.set(res.user);
        this.inactivityNotice.set(null);
        this.startInactivityTimer();
        this.redirectBasedOnRole(res.user.role);
      })
    );
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post<{ success: boolean; message: string; otp?: string }>(`${this.apiUrl}/send-otp`, { email });
  }

  registerWithOtp(payload: any): Observable<any> {
    return this.http.post<{ token?: string; user: User; message: string; pendingApproval?: boolean }>(`${this.apiUrl}/verify-otp-register`, payload).pipe(
      tap(res => {
        if (res.token && res.user) {
          this.token.set(res.token);
          localStorage.setItem('uamp_token', res.token);
          this.currentUser.set(res.user);
          this.inactivityNotice.set(null);
          this.startInactivityTimer();
          this.redirectBasedOnRole(res.user.role);
        }
      })
    );
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.startInactivityTimer();
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  startInactivityTimer(): void {
    this.inactivityService.startTracking(() => {
      this.inactivityNotice.set('You have been logged out due to 10 minutes of inactivity.');
      this.logout();
    });
  }

  logout(): void {
    this.inactivityService.stopTracking();
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('uamp_token');
    this.router.navigate(['/login']);
  }

  redirectBasedOnRole(role: UserRole): void {
    if (role === 'STUDENT') {
      this.router.navigate(['/student/dashboard']);
    } else if (role === 'TEACHER') {
      this.router.navigate(['/teacher/dashboard']);
    } else if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  getToken(): string | null {
    return this.token();
  }
}
