import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  template: `
    <div class="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      <!-- Background Ambient Glow Effects -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-600/30 rounded-full blur-3xl"></div>
      
      <!-- Header Bar -->
      <header class="p-6 flex items-center justify-between z-10 max-w-7xl mx-auto w-full">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <i class="fa-solid fa-graduation-cap text-xl"></i>
          </div>
          <div>
            <h1 class="font-extrabold text-xl tracking-tight font-heading">UAMP Portal</h1>
            <p class="text-xs text-slate-400">University Assessment & Mastery System</p>
          </div>
        </div>
        <app-theme-toggle></app-theme-toggle>
      </header>

      <!-- Main Login / Register Container -->
      <main class="flex-1 flex items-center justify-center p-4 z-10 my-4">
        <div class="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl">
          
          <!-- Tab Navigation Switcher -->
          <div class="flex bg-slate-900/80 p-1.5 rounded-2xl mb-6 border border-slate-700/50">
            <button (click)="switchMode('login')"
                    [class]="mode === 'login' 
                      ? 'flex-1 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-md transition-all' 
                      : 'flex-1 py-2 text-xs font-bold rounded-xl text-slate-400 hover:text-slate-200 transition-all'">
              <i class="fa-solid fa-right-to-bracket mr-1.5"></i> Sign In
            </button>
            <button (click)="switchMode('register')"
                    [class]="mode === 'register' 
                      ? 'flex-1 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-md transition-all' 
                      : 'flex-1 py-2 text-xs font-bold rounded-xl text-slate-400 hover:text-slate-200 transition-all'">
              <i class="fa-solid fa-user-plus mr-1.5"></i> Create Account
            </button>
          </div>

          <!-- SIGN IN MODE -->
          <ng-container *ngIf="mode === 'login'">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-extrabold text-white font-heading">Welcome Back</h2>
              <p class="text-xs text-slate-400 mt-1">Sign in with your University ERP credentials</p>
            </div>

            <!-- Quick Demo Role Switcher Chips -->
            <div class="mb-6 p-3 bg-slate-900/60 rounded-2xl border border-slate-700/50">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">1-Click Quick Demo Sign-In</p>
              <div class="grid grid-cols-3 gap-2">
                <button (click)="fillDemo('student')" class="py-2 px-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex flex-col items-center gap-1">
                  <i class="fa-solid fa-user-graduate"></i>
                  <span>Student</span>
                </button>
                <button (click)="fillDemo('teacher')" class="py-2 px-1 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-bold transition-all flex flex-col items-center gap-1">
                  <i class="fa-solid fa-chalkboard-user"></i>
                  <span>Teacher</span>
                </button>
                <button (click)="fillDemo('admin')" class="py-2 px-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold transition-all flex flex-col items-center gap-1">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>Admin</span>
                </button>
              </div>
            </div>

            <!-- Login Form -->
            <form (ngSubmit)="onSubmitLogin()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Username / ERP ID</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <i class="fa-solid fa-user text-sm"></i>
                  </span>
                  <input type="text" [(ngModel)]="username" name="username" required
                         class="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                         placeholder="Enter username (e.g. student)">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <i class="fa-solid fa-lock text-sm"></i>
                  </span>
                  <input type="password" [(ngModel)]="password" name="password" required
                         class="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                         placeholder="••••••••">
                </div>
              </div>

              <div *ngIf="authService.inactivityNotice() as notice" class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-bounce">
                <i class="fa-solid fa-clock-rotate-left text-sm text-rose-400"></i>
                <span>{{ notice }}</span>
              </div>

              <div *ngIf="errorMessage" class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <i class="fa-solid fa-circle-exclamation text-sm"></i>
                <span>{{ errorMessage }}</span>
              </div>

              <button type="submit" [disabled]="isLoading" 
                      class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2">
                <i *ngIf="isLoading" class="fa-solid fa-spinner animate-spin"></i>
                <span>{{ isLoading ? 'Authenticating...' : 'Sign In to Portal' }}</span>
                <i *ngIf="!isLoading" class="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </form>
          </ng-container>

          <!-- CREATE ACCOUNT MODE (WITH EMAIL OTP) -->
          <ng-container *ngIf="mode === 'register'">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-extrabold text-white font-heading">Register Account</h2>
              <p class="text-xs text-slate-400 mt-1">Instant Email OTP Verification & Setup</p>
            </div>

            <!-- OTP Success Notification Banner -->
            <div *ngIf="otpSuccessMessage" class="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs space-y-1">
              <div class="flex items-center gap-2 font-bold">
                <i class="fa-solid fa-paper-plane text-sm"></i>
                <span>{{ otpSuccessMessage }}</span>
              </div>
              <div *ngIf="demoOtp" class="text-[11px] text-emerald-300 font-mono bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/20 flex items-center justify-between">
                <span>Demo Email OTP: <strong class="text-emerald-200 text-sm tracking-widest">{{ demoOtp }}</strong></span>
                <button (click)="regOtp = demoOtp" type="button" class="text-[10px] underline hover:text-white">Auto-fill</button>
              </div>
            </div>

            <!-- Error Banner -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <i class="fa-solid fa-circle-exclamation text-sm"></i>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Step 1 Form: Details & Email -->
            <form *ngIf="!otpSent" (ngSubmit)="onSendOtp()" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input type="text" [(ngModel)]="regFullName" name="regFullName" required
                       class="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                       placeholder="e.g. Ananya Sen">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Email Address (for OTP)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <i class="fa-solid fa-envelope text-xs"></i>
                  </span>
                  <input type="email" [(ngModel)]="regEmail" name="regEmail" required
                         class="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                         placeholder="student@university.edu">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Username</label>
                  <input type="text" [(ngModel)]="regUsername" name="regUsername" required
                         class="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                         placeholder="ananya2026">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Role</label>
                  <select [(ngModel)]="regRole" name="regRole" 
                          class="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Faculty / Teacher</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Department</label>
                <input type="text" [(ngModel)]="regDepartment" name="regDepartment"
                       class="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                       placeholder="Computer Science & Engineering">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input type="password" [(ngModel)]="regPassword" name="regPassword" required
                       class="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                       placeholder="Create secure password">
              </div>

              <button type="submit" [disabled]="isLoading"
                      class="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4">
                <i *ngIf="isLoading" class="fa-solid fa-spinner animate-spin"></i>
                <i *ngIf="!isLoading" class="fa-solid fa-paper-plane text-xs"></i>
                <span>{{ isLoading ? 'Sending OTP...' : 'Send 6-Digit Email OTP' }}</span>
              </button>
            </form>

            <!-- Step 2 Form: Enter Email OTP & Verify -->
            <form *ngIf="otpSent" (ngSubmit)="onVerifyAndRegister()" class="space-y-4">
              <div class="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl">
                <p class="text-xs text-slate-300">
                  Verifying account for <strong>{{ regEmail }}</strong>
                </p>
                <button type="button" (click)="otpSent = false" class="text-[11px] text-indigo-400 hover:underline mt-1 font-semibold">
                  <i class="fa-solid fa-pen text-[10px] mr-1"></i>Edit details / change email
                </button>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1 text-center uppercase tracking-wider">
                  Enter 6-Digit OTP Code
                </label>
                <div class="relative">
                  <input type="text" [(ngModel)]="regOtp" name="regOtp" required maxlength="6"
                         class="w-full py-3 px-4 text-center tracking-[0.5em] font-mono text-xl bg-slate-900/90 border-2 border-indigo-500/70 rounded-xl text-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                         placeholder="123456">
                </div>
              </div>

              <button type="submit" [disabled]="isLoading"
                      class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2">
                <i *ngIf="isLoading" class="fa-solid fa-spinner animate-spin"></i>
                <i *ngIf="!isLoading" class="fa-solid fa-check-double text-xs"></i>
                <span>{{ isLoading ? 'Verifying OTP...' : 'Verify OTP & Create Account' }}</span>
              </button>

              <div class="text-center pt-1">
                <button type="button" (click)="onSendOtp()" [disabled]="isLoading" class="text-xs text-slate-400 hover:text-white transition-colors">
                  Didn't get code? <span class="text-indigo-400 font-bold hover:underline">Resend OTP</span>
                </button>
              </div>
            </form>
          </ng-container>

        </div>
      </main>

      <!-- Footer Bar -->
      <footer class="p-4 text-center text-xs text-slate-500 z-10">
        University Assessment & Mastery Portal &copy; 2026. Anti-Cheat Live Proctoring Engine active.
      </footer>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  
  mode: 'login' | 'register' = 'login';

  // Login fields
  username = '';
  password = '';
  
  // Register fields
  regFullName = '';
  regEmail = '';
  regUsername = '';
  regPassword = '';
  regRole: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT';
  regDepartment = 'Computer Science & Engineering';
  regOtp = '';

  otpSent = false;
  demoOtp = '';
  otpSuccessMessage = '';
  isLoading = false;
  errorMessage = '';

  switchMode(targetMode: 'login' | 'register'): void {
    this.mode = targetMode;
    this.errorMessage = '';
    this.otpSuccessMessage = '';
  }

  fillDemo(role: string): void {
    if (role === 'student') {
      this.username = 'student';
    } else if (role === 'teacher') {
      this.username = 'teacher';
    } else if (role === 'admin') {
      this.username = 'admin';
    }
    this.password = '';
    this.errorMessage = '';
  }

  onSubmitLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Authentication failed. Please check credentials.';
      }
    });
  }

  onSendOtp(): void {
    if (!this.regFullName || !this.regEmail || !this.regUsername || !this.regPassword) {
      this.errorMessage = 'Please fill out all registration fields.';
      return;
    }

    if (!this.regEmail.includes('@')) {
      this.errorMessage = 'Please enter a valid email address for OTP delivery.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.otpSuccessMessage = '';

    this.authService.sendOtp(this.regEmail).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.otpSent = true;
        this.demoOtp = res.otp || '';
        this.otpSuccessMessage = res.message || 'Verification OTP sent to your email.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to dispatch OTP. Please try again.';
      }
    });
  }

  onVerifyAndRegister(): void {
    if (!this.regOtp || this.regOtp.length < 4) {
      this.errorMessage = 'Please enter the 6-digit OTP code sent to your email.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      fullName: this.regFullName,
      email: this.regEmail,
      username: this.regUsername,
      password: this.regPassword,
      role: this.regRole,
      department: this.regDepartment,
      otp: this.regOtp
    };

    this.authService.registerWithOtp(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.pendingApproval) {
          this.otpSent = false;
          this.otpSuccessMessage = res.message || 'Account registered & verified via OTP! Pending Admin approval before login.';
          this.mode = 'login';
          this.username = this.regUsername;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Check your OTP and try again.';
      }
    });
  }
}

