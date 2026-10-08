import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProctoringService, ActiveProctorSession } from '../../../core/services/proctoring.service';

@Component({
  selector: 'app-teacher-live-proctoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Faculty Live Proctoring Dashboard</h1>
          <p class="text-xs text-slate-500">Real-time WebCam stream grid & Anti-Cheat tab-switch warning monitor</p>
        </div>

        <div class="flex items-center gap-3">
          <span class="badge badge-success flex items-center gap-1.5 px-3 py-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {{ sessions.length }} Active Student Feeds
          </span>
          <button (click)="loadSessions()" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-rotate text-indigo-500"></i> Refresh Feeds
          </button>
        </div>
      </div>

      <!-- Live WebCam Streams Grid -->
      <div *ngIf="sessions.length === 0" class="uamp-card p-12 text-center space-y-3">
        <i class="fa-solid fa-video-slash text-4xl text-slate-400"></i>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">No Active Exam Proctoring Streams</h3>
        <p class="text-xs text-slate-500">Student webcam streams will appear live as soon as candidates launch proctored examinations.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let s of sessions" 
             [ngClass]="s.warningCount > 0 ? 'border-rose-500/60 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-800'"
             class="uamp-card p-4 space-y-4 relative overflow-hidden">
          
          <!-- Stream Header Info -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ s.studentName }}</h3>
              <p class="text-[11px] font-mono text-slate-400">{{ s.erpId }} • {{ s.department }}</p>
            </div>

            <span [ngClass]="s.warningCount > 0 ? 'badge-danger animate-pulse' : 'badge-success'" class="badge text-[10px]">
              {{ s.warningCount > 0 ? s.warningCount + ' STRIKE WARNING' : 'CLEAN SESSION' }}
            </span>
          </div>

          <!-- Video Frame Snapshot Player -->
          <div class="proctor-video-box rounded-2xl overflow-hidden bg-black relative aspect-video" [ngClass]="{'has-warning': s.warningCount > 0}">
            <img *ngIf="s.frame" [src]="s.frame" alt="Live Proctor Frame" class="w-full h-full object-cover">
            
            <div *ngIf="!s.frame" class="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-500 text-xs font-mono">
              <span>STREAM CONNECTING...</span>
            </div>

            <div class="proctor-live-badge">
              <span class="proctor-live-dot"></span> LIVE WEBAM
            </div>

            <div class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono">
              Q: {{ s.currentQuestion }} • Updated: {{ s.lastUpdated }}
            </div>
          </div>

          <!-- Action Controls -->
          <div class="flex items-center justify-between pt-2 text-xs">
            <span class="text-slate-500 text-[11px]">Exam: DBMS Mid-Sem</span>
            <div class="flex items-center gap-2">
              <button (click)="openWarningModal(s)" class="btn btn-warning btn-sm text-[11px] font-bold">
                <i class="fa-solid fa-paper-plane"></i> Warn
              </button>
              <button (click)="flagStudent(s)" class="btn btn-danger btn-sm text-[11px]">
                <i class="fa-solid fa-flag"></i> Flag
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
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Faculty Proctor Warning</h3>
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
              <button (click)="warningText = 'Please adjust your webcam angle to keep your face centered.'" class="btn btn-outline text-left py-2 px-3 text-[11px]">
                📷 Adjust Camera Angle
              </button>
              <button (click)="warningText = 'Frequent eye movement detected. Please keep eyes on question paper.'" class="btn btn-outline text-left py-2 px-3 text-[11px]">
                👀 Focus On Screen
              </button>
              <button (click)="warningText = 'Maintain total silence during the online proctored examination.'" class="btn btn-outline text-left py-2 px-3 text-[11px]">
                🔊 Maintain Silence
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Custom Message</label>
            <textarea [(ngModel)]="warningText" rows="3" class="form-control" placeholder="Type custom message..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button (click)="closeWarningModal()" class="btn btn-outline btn-sm">Cancel</button>
            <button (click)="dispatchWarning()" [disabled]="!warningText" class="btn btn-warning btn-sm font-bold shadow-md">
              <i class="fa-solid fa-paper-plane"></i> Dispatch Warning
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class LiveProctoringComponent implements OnInit, OnDestroy {
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
    this.warningText = 'Please adjust your webcam angle to keep your face centered.';
  }

  closeWarningModal(): void {
    this.selectedSession = null;
    this.warningText = '';
  }

  dispatchWarning(): void {
    if (!this.selectedSession || !this.warningText) return;
    this.proctoringService.sendProctorWarning(this.selectedSession.studentId, this.warningText).subscribe(() => {
      alert(`Warning sent to candidate ${this.selectedSession?.studentName}.`);
      this.closeWarningModal();
    });
  }

  flagStudent(s: ActiveProctorSession): void {
    alert(`Flagged suspicious activity for candidate ${s.studentName} (${s.erpId}). Flag recorded in security audit logs.`);
  }
}
