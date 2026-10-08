import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  template: `
    <header class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <i class="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-heading">UAMP</span>
                <span class="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">v3.0</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">University Assessment & Mastery Portal</p>
            </div>
          </div>

          <!-- User Badge & Actions -->
          <div class="flex items-center gap-4">
            
            <!-- Theme Toggle Button -->
            <app-theme-toggle></app-theme-toggle>

            <ng-container *ngIf="authService.currentUser() as user">
              <!-- Role Badge -->
              <span [ngClass]="{
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300': user.role === 'STUDENT',
                'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300': user.role === 'TEACHER',
                'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300': user.role === 'ADMIN'
              }" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-current/10">
                <i [class]="{
                  'fa-solid fa-user-graduate': user.role === 'STUDENT',
                  'fa-solid fa-chalkboard-user': user.role === 'TEACHER',
                  'fa-solid fa-shield-halved': user.role === 'ADMIN'
                }"></i>
                {{ user.role }}
              </span>

              <!-- User Profile Chip -->
              <div class="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <img [src]="user.photoPath || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'" 
                     [alt]="user.fullName" 
                     class="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30">
                <div class="hidden md:block text-left">
                  <p class="text-xs font-bold text-slate-900 dark:text-white leading-none">{{ user.fullName }}</p>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ user.erpId }}</p>
                </div>
              </div>

              <!-- Logout Button -->
              <button (click)="authService.logout()" 
                      class="btn btn-outline btn-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/50"
                      title="Sign Out">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span class="hidden sm:inline">Logout</span>
              </button>
            </ng-container>

          </div>

        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
}
