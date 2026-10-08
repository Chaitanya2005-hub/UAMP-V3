import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProctoringService, ActiveProctorSession } from '../../../core/services/proctoring.service';

@Component({
  selector: 'app-admin-live-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Enterprise Anti-Cheat Live Monitoring Grid</h1>
          <p class="text-xs text-slate-500">Live WebCam streams, 3-strike tab switch alerts & session intervention controls</p>
        </div>

        <div class="flex items-center gap-3">
          <span class="badge badge-success flex items-center gap-1.5 px-3 py-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {{ sessions.length }} Active Examination Sessions
          </span>
          <button (click)="loadSessions()" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-rotate text-indigo-500"></i> Refresh Grid
          </button>
        </div>
      </div>

      <!-- No Stream Alert -->
      <div *ngIf="sessions.length === 0" class="uamp-card p-12 text-center space-y-3">
        <i class="fa-solid fa-shield-cat text-4xl text-slate-400"></i>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">No Active Candidate Streams</h3>
        <p class="text-xs text-slate-500">Student webcam frames will automatically stream to this dashboard upon launching an exam.</p>
      </div>

      <!-- Active Sessions Video Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let s of sessions" 
             [ngClass]="s.warningCount > 0 ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-800'"
             class="uamp-card p-4 space-y-4 relative overflow-hidden bg-white dark:bg-slate-900">
          
          <!-- Student Card Header -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ s.studentName }}</h3>
              <p class="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">{{ s.erpId }} • {{ s.department }}</p>
            </div>

            <span [ngClass]="s.warningCount > 0 ? 'badge-danger animate-bounce' : 'badge-success'" class="badge text-[10px]">
              <i [class]="s.warningCount > 0 ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-check'"></i>
              {{ s.warningCount > 0 ? s.warningCount + ' TAB STRIKES' : 'CLEAN SESSION' }}
            </span>
          </div>

          <!-- Video Stream Container -->
          <div class="proctor-video-box rounded-2xl overflow-hidden bg-black relative aspect-video" [ngClass]="{'has-warning': s.warningCount > 0}">
            <img *ngIf="s.frame" [src]="s.frame" alt="Student WebCam Stream" class="w-full h-full object-cover">
            
            <div *ngIf="!s.frame" class="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-500 text-xs font-mono">
              <span>CAMERA STREAM INITIALIZING...</span>
            </div>

            <div class="proctor-live-badge">
              <span class="proctor-live-dot"></span> ADMIN LIVE MONITOR
            </div>

            <div class="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white font-mono flex items-center gap-2">
              <span>Question {{ s.currentQuestion }}</span>
              <span>•</span>
              <span class="text-indigo-400">{{ s.lastUpdated }}</span>
            </div>
          </div>

          <!-- Admin Control Actions -->
          <div class="flex items-center justify-between pt-2">
            <span class="text-[11px] font-semibold text-slate-500">Status: {{ s.status }}</span>
            
            <div class="flex items-center gap-1.5">
              <button (click)="openWarningModal(s)" class="btn btn-warning btn-sm text-[11px] font-bold">
                <i class="fa-solid fa-paper-plane"></i> Warn Student
              </button>
              <button (click)="terminateSession(s)" class="btn btn-danger btn-sm text-[11px]">
                <i class="fa-solid fa-ban"></i> Terminate
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- PROCTOR DIRECT WARNING DISPATCH MODAL -->
      <div *ngIf="selectedSession" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl font-bold">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Dispatch Live Proctor Warning</h3>
                <p class="text-xs text-slate-500">Candidate: {{ selectedSession.studentName }} ({{ selectedSession.erpId }})</p>
              </div>
            </div>
            <button (click)="closeWarningModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Preset Warning Buttons -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-500 uppercase">Quick Preset Warnings</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button (click)="warningText = 'Please position your camera so your full face is visible.'" class="btn btn-outline text-left py-2 px-3 text-[11px]">
                📷 Adjust Camera Angle
              </button>
              <button (click)="warningText = 'Excessive head movements detected. Please focus on your screen.'" class="btn btn-outline text-left py-2 px-3 text-[11px]">
                👀 Excessive Movement
              </button>
              <button (click)="warningText = 'Multiple voices/background noise detected in your room.'" class="btn btn-outline text-left py-2 px-3 text-[11px]">
                🔊 Background Audio Alert
              </button>
              <button (click)="warningText = 'Do not move out of camera frame during active exam.'" class="btn btn-outline text-left py-2 px-3 text-[11px]">
                ⚠️ Stay In Frame
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Custom Warning Message</label>
            <textarea [(ngModel)]="warningText" rows="3" class="form-control" placeholder="Type custom proctor message..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button (click)="closeWarningModal()" class="btn btn-outline btn-sm">Cancel</button>
            <button (click)="dispatchWarning()" [disabled]="!warningText" class="btn btn-warning btn-sm font-bold shadow-md">
              <i class="fa-solid fa-paper-plane"></i> Send Live Warning Now
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class LiveMonitoringComponent implements OnInit, OnDestroy {
  proctoringService = inject(ProctoringService);

  sessions: ActiveProctorSession[] = [];
  pollInterval: any;
  selectedSession: ActiveProctorSession | null = null;
  warningText: string = '';

  ngOnInit(): void {
    this.loadSessions();
    this.pollInterval = setInterval(() => {
      this.loadSessions();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadSessions(): void {
    this.proctoringService.getActiveSessions().subscribe(res => {
      this.sessions = res;
    });
  }

  openWarningModal(s: ActiveProctorSession): void {
    this.selectedSession = s;
    this.warningText = 'Please position your camera so your full face is visible.';
  }

  closeWarningModal(): void {
    this.selectedSession = null;
    this.warningText = '';
  }

  dispatchWarning(): void {
    if (!this.selectedSession || !this.warningText) return;
    this.proctoringService.sendProctorWarning(this.selectedSession.studentId, this.warningText).subscribe(() => {
      alert(`Live warning message successfully sent to ${this.selectedSession?.studentName}!`);
      this.closeWarningModal();
    });
  }

  terminateSession(s: ActiveProctorSession): void {
    if (confirm(`Are you sure you want to force terminate the proctored exam for ${s.studentName}?`)) {
      alert(`Exam session for ${s.studentName} terminated by Administrator.`);
    }
  }
}
