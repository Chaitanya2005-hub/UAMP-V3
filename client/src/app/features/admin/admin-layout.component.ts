import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <app-navbar></app-navbar>

      <!-- Admin Navigation Tab Bar -->
      <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-chart-pie"></i>
              <span>Admin Dashboard</span>
            </a>
            <a routerLink="/admin/live-monitoring" routerLinkActive="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-shield-halved text-rose-500"></i>
              <span>Live WebCam Monitoring</span>
            </a>
            <a routerLink="/admin/manage-admit-cards" routerLinkActive="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-id-card text-emerald-500"></i>
              <span>Manage Admit Cards</span>
            </a>
            <a routerLink="/admin/fees" routerLinkActive="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-receipt text-amber-500"></i>
              <span>Fee Approvals & Edits</span>
            </a>
            <a routerLink="/admin/schedule-exam" routerLinkActive="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-calendar-plus text-sky-500"></i>
              <span>Schedule Exam</span>
            </a>
            <a routerLink="/admin/manage-users" routerLinkActive="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-users-gear"></i>
              <span>User Management</span>
            </a>
            <a routerLink="/admin/manage-subjects" routerLinkActive="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold" 
               class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 whitespace-nowrap transition-all">
              <i class="fa-solid fa-book-bookmark"></i>
              <span>Subjects</span>
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
export class AdminLayoutComponent {}
