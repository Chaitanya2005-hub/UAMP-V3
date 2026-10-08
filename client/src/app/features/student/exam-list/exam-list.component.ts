import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { ProctoringService } from '../../../core/services/proctoring.service';
import { Exam } from '../../../core/models/exam.model';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Proctored Examinations Portal</h1>
          <p class="text-xs text-slate-500">Live AI & WebCam monitored academic assessments</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="testWebcam()" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-camera-retro text-indigo-500"></i> Test WebCam Feed
          </button>
        </div>
      </div>

      <!-- WebCam Hardware Readiness Modal -->
      <div *ngIf="showWebcamTestModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">WebCam Hardware Diagnostic</h3>
            <button (click)="closeWebcamTest()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="proctor-video-box rounded-2xl overflow-hidden bg-black relative">
            <video #previewVideo autoplay muted playsinline class="w-full h-full object-cover"></video>
            <div *ngIf="!webcamStatus" class="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-xs text-slate-400">
              <span>Initializing Camera Feed...</span>
            </div>
            <div *ngIf="webcamStatus" class="proctor-live-badge">
              <span class="proctor-live-dot"></span> LIVE FEED OK
            </div>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400">
            Verify that your face is clearly visible, illuminated, and centered before launching any proctored test.
          </p>

          <button (click)="closeWebcamTest()" class="w-full btn btn-primary">
            Close Camera Diagnostic
          </button>
        </div>
      </div>

      <!-- Exam Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let exam of exams" class="uamp-card flex flex-col justify-between relative overflow-hidden group">
          
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-2">
              <span [ngClass]="{
                'badge-warning': exam.status === 'SCHEDULED',
                'badge-success': exam.status === 'ONGOING',
                'badge-info': exam.status === 'COMPLETED'
              }" class="badge">
                {{ exam.status }}
              </span>
              <span class="text-xs font-mono text-slate-400">ID: {{ exam.id }}</span>
            </div>

            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {{ exam.title }}
              </h3>
              <p class="text-xs font-semibold text-indigo-500 mt-0.5">{{ exam.subjectName }}</p>
            </div>

            <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex items-center justify-between">
                <span><i class="fa-regular fa-calendar text-slate-400 mr-2"></i>Date:</span>
                <span class="font-semibold">{{ exam.examDate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span><i class="fa-regular fa-clock text-slate-400 mr-2"></i>Start Time:</span>
                <span class="font-semibold">{{ exam.startTime }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span><i class="fa-solid fa-hourglass-half text-slate-400 mr-2"></i>Duration:</span>
                <span class="font-semibold">{{ exam.durationMinutes }} Minutes</span>
              </div>
              <div class="flex items-center justify-between">
                <span><i class="fa-solid fa-shield-halved text-slate-400 mr-2"></i>Proctoring:</span>
                <span class="font-bold text-emerald-500">3-Strike Live Cam</span>
              </div>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button [routerLink]="['/student/exam-interface', exam.id]" 
                    [disabled]="exam.status === 'COMPLETED'"
                    [ngClass]="exam.status === 'COMPLETED' ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-primary'"
                    class="w-full btn btn-sm">
              <i [class]="exam.status === 'COMPLETED' ? 'fa-solid fa-circle-check' : 'fa-solid fa-arrow-right-to-bracket'"></i>
              <span>{{ exam.status === 'COMPLETED' ? 'Assessment Submitted' : 'Launch Examination' }}</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class ExamListComponent implements OnInit {
  examService = inject(ExamService);
  proctoringService = inject(ProctoringService);
  router = inject(Router);

  exams: Exam[] = [];
  showWebcamTestModal = false;
  webcamStatus = false;

  ngOnInit(): void {
    this.examService.getExams().subscribe(data => {
      this.exams = data;
    });
  }

  async testWebcam(): Promise<void> {
    this.showWebcamTestModal = true;
    const stream = await this.proctoringService.startWebcam();
    if (stream) {
      this.webcamStatus = true;
      setTimeout(() => {
        const videoEl = document.querySelector('video') as HTMLVideoElement;
        if (videoEl) videoEl.srcObject = stream;
      }, 100);
    }
  }

  closeWebcamTest(): void {
    this.proctoringService.stopWebcam();
    this.showWebcamTestModal = false;
    this.webcamStatus = false;
  }
}
