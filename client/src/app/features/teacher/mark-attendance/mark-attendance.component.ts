import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../core/services/attendance.service';
import { LiveCode } from '../../../core/models/attendance.model';

@Component({
  selector: 'app-teacher-mark-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto text-center">
      
      <!-- Header Banner -->
      <div class="space-y-2">
        <span class="badge badge-success inline-flex items-center gap-2 text-xs px-3 py-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Auto-Refreshing QR Attendance Host
        </span>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Classroom Attendance Broadcast</h1>
        <p class="text-xs text-slate-500">Polls server every 10s • Token expiration 60s</p>
      </div>

      <!-- Live QR Display Box -->
      <div *ngIf="currentCode" class="uamp-card max-w-md mx-auto p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        <!-- Timer Bar -->
        <div class="flex items-center justify-between text-xs text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3">
          <span>Auto Refresh: <strong class="text-indigo-500">{{ countdownSeconds }}s</strong></span>
          <span class="font-mono text-emerald-500 font-bold">STATUS: ACTIVE</span>
        </div>

        <!-- QR Code Image -->
        <div class="p-4 bg-white rounded-3xl border-2 border-indigo-500/30 inline-block shadow-lg">
          <img [src]="currentCode.qrDataUrl" alt="Live Attendance QR" class="w-64 h-64 mx-auto object-contain">
        </div>

        <!-- 4-Digit Display Pin -->
        <div class="space-y-1">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-widest block">Classroom Entry PIN Code</span>
          <div class="text-4xl font-extrabold font-mono tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 py-3 px-6 rounded-2xl inline-block border border-indigo-500/30 shadow-inner">
            {{ currentCode.code }}
          </div>
        </div>

        <p class="text-xs text-slate-400">
          Students can scan QR image or type PIN code in their student portal to record presence.
        </p>

      </div>

    </div>
  `
})
export class MarkAttendanceComponent implements OnInit, OnDestroy {
  attendanceService = inject(AttendanceService);
  
  currentCode: LiveCode | null = null;
  pollInterval: any;
  countdownSeconds: number = 10;
  countdownInterval: any;

  ngOnInit(): void {
    this.fetchCode();
    
    // Poll every 10 seconds
    this.pollInterval = setInterval(() => {
      this.fetchCode();
      this.countdownSeconds = 10;
    }, 10000);

    this.countdownInterval = setInterval(() => {
      if (this.countdownSeconds > 0) {
        this.countdownSeconds--;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  fetchCode(): void {
    this.attendanceService.getTeacherQrCode().subscribe(code => {
      this.currentCode = code;
    });
  }
}
