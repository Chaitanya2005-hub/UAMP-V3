import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <app-navbar></app-navbar>

      <!-- Faculty Navigation Tab Bar -->
      <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            <a routerLink="/teacher/dashboard" routerLinkActive="bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-chart-pie"></i>
              <span>Faculty Dashboard</span>
            </a>
            <a routerLink="/teacher/upload-questions" routerLinkActive="bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
              <span>Question Bank & AI Generator</span>
            </a>
            <a routerLink="/teacher/mark-attendance" routerLinkActive="bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-qrcode text-emerald-500"></i>
              <span>Live QR Attendance Host</span>
            </a>
            <a routerLink="/teacher/live-proctoring" routerLinkActive="bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-video text-rose-500"></i>
              <span>Live Proctoring Monitor</span>
            </a>
            <a routerLink="/teacher/student-progress" routerLinkActive="bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-chart-line"></i>
              <span>Student Performance Analytics</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Main Content Outlet -->
      <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class TeacherLayoutComponent {}
