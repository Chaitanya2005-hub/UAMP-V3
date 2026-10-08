import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, InrCurrencyPipe],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Welcome Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-purple-900/10">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/20">
              <i class="fa-solid fa-shield-halved"></i> University Controller & Administrator Portal
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              System Executive Dashboard
            </h1>
            <p class="text-xs sm:text-sm text-purple-200 max-w-xl">
              Academic Operations • Live Anti-Cheat WebCam Monitoring Grid • Fee Accounts & Hall Tickets
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <a routerLink="/admin/live-monitoring" class="btn bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-lg">
              <i class="fa-solid fa-display"></i> Open Live Proctoring Grid
            </a>
          </div>
        </div>
      </div>

      <!-- System Quick Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card 
          title="Total Registered Users" 
          value="1,240" 
          subtitle="3 Roles (Student, Faculty, Admin)"
          iconClass="fa-solid fa-users-gear"
          iconBgClass="bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
        </app-stat-card>

        <app-stat-card 
          title="Scheduled Exams" 
          value="12" 
          subtitle="Proctored Anti-Cheat Active"
          iconClass="fa-solid fa-laptop-code"
          iconBgClass="bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
        </app-stat-card>

        <app-stat-card 
          title="Fee Revenue Cleared" 
          value="₹1,70,000" 
          subtitle="85% Approval Rate"
          iconClass="fa-solid fa-receipt"
          iconBgClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          trend="up">
        </app-stat-card>

        <app-stat-card 
          title="Hall Tickets Released" 
          value="89%" 
          subtitle="11% Blocked Dues"
          iconClass="fa-solid fa-id-card"
          iconBgClass="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
        </app-stat-card>
      </div>

      <!-- Admin Actions Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <a routerLink="/admin/manage-admit-cards" class="uamp-card hover:border-emerald-500/50 transition-all p-6 group space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-id-card"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Block / Release Admit Cards</h3>
          <p class="text-xs text-slate-500">Instant toggle controls to hold or release hall tickets for students based on fee clearance.</p>
        </a>

        <a routerLink="/admin/fees" class="uamp-card hover:border-amber-500/50 transition-all p-6 group space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-calculator"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Fee Amount Edits & Approvals</h3>
          <p class="text-xs text-slate-500">Edit student total/paid amounts and approve/disapprove tuition fee payments.</p>
        </a>

        <a routerLink="/admin/live-monitoring" class="uamp-card hover:border-rose-500/50 transition-all p-6 group space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Anti-Cheat Live Grid</h3>
          <p class="text-xs text-slate-500">Enterprise grid of active student video feeds with tab-switch warning badges and remote flag controls.</p>
        </a>

      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {}
}
