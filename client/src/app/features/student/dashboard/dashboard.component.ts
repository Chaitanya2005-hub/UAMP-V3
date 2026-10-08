import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ExamService } from '../../../core/services/exam.service';
import { AdmitCardService } from '../../../core/services/admit-card.service';
import { FeeService } from '../../../core/services/fee.service';
import { HttpClient } from '@angular/common/http';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { Exam } from '../../../core/models/exam.model';
import { AdmitCard } from '../../../core/models/admit-card.model';
import { Fee } from '../../../core/models/fee.model';
import { Notice } from '../../../core/models/notice.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Welcome Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 text-white p-6 sm:p-8 shadow-xl shadow-indigo-600/10">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/20">
              <i class="fa-solid fa-graduation-cap"></i> Student Academic Portal
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Welcome back, {{ authService.currentUser()?.fullName }}!
            </h1>
            <p class="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Academic Year 2026 • {{ authService.currentUser()?.department }} • Section {{ authService.currentUser()?.section }}
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <a routerLink="/student/exams" class="btn bg-white text-indigo-700 hover:bg-slate-100 font-bold shadow-lg">
              <i class="fa-solid fa-laptop-code"></i> Launch Exam Portal
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card 
          title="Overall Attendance" 
          value="92.4%" 
          subtitle="Cleared for exams"
          iconClass="fa-solid fa-user-check"
          iconBgClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          trend="up">
        </app-stat-card>

        <app-stat-card 
          title="Scheduled Exams" 
          [value]="upcomingExams.length" 
          subtitle="Next exam on 15 Oct"
          iconClass="fa-solid fa-calendar-check"
          iconBgClass="bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
        </app-stat-card>

        <app-stat-card 
          title="Admit Card Status" 
          [value]="admitCard?.status || 'LOADING'" 
          [subtitle]="admitCard?.status === 'RELEASED' ? 'Hall Ticket ready to download' : 'Action required on fees'"
          iconClass="fa-solid fa-id-card"
          [iconBgClass]="admitCard?.status === 'RELEASED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'">
        </app-stat-card>

        <app-stat-card 
          title="Tuition Fee Dues" 
          [value]="feeStatus?.paidAmount === feeStatus?.totalAmount ? 'CLEARED' : 'PARTIAL DUES'" 
          [subtitle]="feeStatus?.approvalStatus === 'APPROVED' ? 'Cleared by Accounts' : 'Pending Verification'"
          iconClass="fa-solid fa-receipt"
          iconBgClass="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
        </app-stat-card>
      </div>

      <!-- Main 2-Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left 2 Cols: Upcoming Exams & Quick Actions -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Upcoming Exams Card -->
          <div class="uamp-card">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Upcoming Examinations</h2>
                <p class="text-xs text-slate-500">Live WebCam proctored assessments</p>
              </div>
              <a routerLink="/student/exams" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All</a>
            </div>

            <div class="space-y-3">
              <div *ngFor="let exam of upcomingExams" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                    <i class="fa-solid fa-file-signature"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ exam.title }}</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ exam.subjectName }} • {{ exam.durationMinutes }} Minutes</p>
                    <div class="flex items-center gap-3 mt-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <span><i class="fa-regular fa-calendar text-indigo-500 mr-1"></i>{{ exam.examDate }}</span>
                      <span><i class="fa-regular fa-clock text-indigo-500 mr-1"></i>{{ exam.startTime }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <a [routerLink]="['/student/exam-interface', exam.id]" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-play"></i> Start Exam
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Portal Action Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <a routerLink="/student/admit-card" class="uamp-card hover:border-indigo-500/50 transition-all flex items-center gap-4 group">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-id-card"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Download Hall Ticket</h3>
                <p class="text-xs text-slate-500">Official printable PDF admit card</p>
              </div>
            </a>

            <a routerLink="/student/attendance" class="uamp-card hover:border-indigo-500/50 transition-all flex items-center gap-4 group">
              <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-qrcode"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Mark QR Attendance</h3>
                <p class="text-xs text-slate-500">Instant live lecture check-in</p>
              </div>
            </a>

          </div>

        </div>

        <!-- Right 1 Col: Notices & System Status -->
        <div class="space-y-6">
          
          <!-- Notices Board -->
          <div class="uamp-card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-bullhorn text-amber-500"></i> Official Notices
              </h2>
              <span class="badge badge-info">Latest</span>
            </div>

            <div class="space-y-3">
              <div *ngFor="let notice of notices" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span class="font-semibold text-indigo-500">{{ notice.postedBy }}</span>
                  <span>{{ notice.postedDate }}</span>
                </div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white mb-1">{{ notice.title }}</h4>
                <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{{ notice.message }}</p>
              </div>
            </div>
          </div>

          <!-- Anti-Cheat Readiness Card -->
          <div class="uamp-card bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-indigo-900/50">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <i class="fa-solid fa-video"></i>
              </div>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">WebCam Proctoring Ready</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed mb-4">
              Your browser camera hardware is supported. Ensure tab switching is avoided during proctored examinations to prevent 3-Strike penalty force submission.
            </p>
            <div class="flex items-center justify-between text-[11px] text-indigo-300 pt-2 border-t border-indigo-900/60">
              <span>Status: Active</span>
              <span>Hardware Check Passed</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  authService = inject(AuthService);
  examService = inject(ExamService);
  admitCardService = inject(AdmitCardService);
  feeService = inject(FeeService);
  http = inject(HttpClient);

  upcomingExams: Exam[] = [];
  admitCard: AdmitCard | null = null;
  feeStatus: Fee | null = null;
  notices: Notice[] = [];

  ngOnInit(): void {
    this.examService.getExams().subscribe(data => {
      this.upcomingExams = data;
    });

    this.admitCardService.getMyAdmitCard().subscribe(card => {
      this.admitCard = card;
    });

    this.feeService.getMyFeeStatus().subscribe(fee => {
      this.feeStatus = fee;
    });

    this.http.get<Notice[]>('http://localhost:3000/api/notices').subscribe(notices => {
      this.notices = notices;
    });
  }
}
