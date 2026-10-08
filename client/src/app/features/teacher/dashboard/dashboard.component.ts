import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ProctoringService } from '../../../core/services/proctoring.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Welcome Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 shadow-xl shadow-sky-600/10">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/20">
              <i class="fa-solid fa-chalkboard-user"></i> Faculty Administration Portal
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Welcome, {{ authService.currentUser()?.fullName }}
            </h1>
            <p class="text-xs sm:text-sm text-sky-100 max-w-xl">
              Department of {{ authService.currentUser()?.department }} • Live Examination & Proctoring Suite
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <a routerLink="/teacher/upload-questions" class="btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg">
              <i class="fa-solid fa-wand-magic-sparkles"></i> AI Question Generator
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card 
          title="Active Students Enrolled" 
          value="142" 
          subtitle="Across CS-A and CS-B"
          iconClass="fa-solid fa-users"
          iconBgClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        </app-stat-card>

        <app-stat-card 
          title="Ongoing Proctored Exam" 
          value="DBMS Mid-Sem" 
          subtitle="3 Active Live Feeds"
          iconClass="fa-solid fa-video"
          iconBgClass="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
        </app-stat-card>

        <app-stat-card 
          title="Questions in Bank" 
          value="248" 
          subtitle="+15 Gemini AI Generated"
          iconClass="fa-solid fa-cubes"
          iconBgClass="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
        </app-stat-card>

        <app-stat-card 
          title="Class Average Score" 
          value="84.2%" 
          subtitle="Passed rate 91%"
          iconClass="fa-solid fa-chart-column"
          iconBgClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
        </app-stat-card>
      </div>

      <!-- Quick Launch Options Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <a routerLink="/teacher/mark-attendance" class="uamp-card hover:border-emerald-500/50 transition-all p-6 group space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-qrcode"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Host Live QR Attendance</h3>
          <p class="text-xs text-slate-500">Generate auto-refreshing 4-digit attendance QR code for classroom broadcasts.</p>
        </a>

        <a routerLink="/teacher/live-proctoring" class="uamp-card hover:border-rose-500/50 transition-all p-6 group space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-display"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Live Proctoring Grid</h3>
          <p class="text-xs text-slate-500">Monitor active student webcam streams & tab-switch warning alerts in real time.</p>
        </a>

        <a routerLink="/teacher/upload-questions" class="uamp-card hover:border-amber-500/50 transition-all p-6 group space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Gemini AI Generator</h3>
          <p class="text-xs text-slate-500">Automatically create topic-tailored multiple choice questions with custom difficulty.</p>
        </a>

      </div>

    </div>
  `
})
export class TeacherDashboardComponent implements OnInit {
  authService = inject(AuthService);
  proctoringService = inject(ProctoringService);

  ngOnInit(): void {}
}
