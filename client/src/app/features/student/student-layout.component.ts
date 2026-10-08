import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <app-navbar></app-navbar>

      <!-- Student Navigation Tab Bar -->
      <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            <a routerLink="/student/dashboard" routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-chart-pie"></i>
              <span>Dashboard</span>
            </a>
            <a routerLink="/student/exams" routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-laptop-code"></i>
              <span>Proctored Exams</span>
            </a>
            <a routerLink="/student/attendance" routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-qrcode"></i>
              <span>QR Attendance</span>
            </a>
            <a routerLink="/student/admit-card" routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-id-card"></i>
              <span>Hall Ticket / Admit Card</span>
            </a>
            <a routerLink="/student/fee-details" routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-receipt"></i>
              <span>Fee Details</span>
            </a>
            <a routerLink="/student/results" routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-square-poll-vertical"></i>
              <span>Results & Analytics</span>
            </a>
            <a routerLink="/student/grievances" routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-comment-dots"></i>
              <span>Grievances</span>
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
export class StudentLayoutComponent {}
