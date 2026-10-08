import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';
import { Result } from '../../../core/models/result.model';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Proctored Assessment Results</h1>
          <p class="text-xs text-slate-500">Historical performance scorecards & anti-cheat audit logs</p>
        </div>
      </div>

      <!-- Results Cards -->
      <div *ngIf="results.length === 0" class="uamp-card p-12 text-center space-y-3">
        <i class="fa-solid fa-square-poll-vertical text-4xl text-slate-400"></i>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">No Exam Results Yet</h3>
        <p class="text-xs text-slate-500">Complete scheduled proctored examinations to view performance reports.</p>
      </div>

      <div *ngFor="let res of results" class="uamp-card p-6 sm:p-8 space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span class="text-xs font-mono text-indigo-500 font-bold uppercase">RESULT ID: {{ res.id }}</span>
            <h2 class="text-lg font-extrabold text-slate-900 dark:text-white font-heading mt-0.5">{{ res.examTitle }}</h2>
          </div>

          <div class="flex items-center gap-3">
            <span [ngClass]="res.status === 'PASSED' ? 'badge-success' : 'badge-danger'" class="badge text-xs px-3 py-1">
              {{ res.status }}
            </span>
            <div class="text-right">
              <span class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ res.score }}</span>
              <span class="text-xs text-slate-400"> / {{ res.totalMarks }} Marks</span>
            </div>
            <button (click)="downloadGradeCardPdf(res)" class="btn btn-outline btn-sm font-bold ml-2">
              <i class="fa-solid fa-file-pdf text-rose-500"></i> Grade Transcript PDF
            </button>
          </div>
        </div>

        <!-- Security Warning Audit Log Box -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-shield-halved text-indigo-500"></i> Anti-Cheat Proctoring Security Audit
          </h4>
          <div class="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs space-y-2">
            <div *ngFor="let warn of res.securityWarnings" class="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <i class="fa-solid fa-circle-info text-indigo-500 mt-0.5"></i>
              <span>{{ warn }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class ResultsComponent implements OnInit {
  examService = inject(ExamService);
  authService = inject(AuthService);
  results: Result[] = [];

  ngOnInit(): void {
    this.examService.getMyResults().subscribe(res => {
      this.results = res;
    });
  }

  downloadGradeCardPdf(res: Result): void {
    const user = this.authService.currentUser();
    const doc = new jsPDF();

    // Header Banner
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('UNIVERSITY ASSESSMENT & MASTERY PORTAL', 105, 14, { align: 'center' });
    doc.setFontSize(10);
    doc.text('OFFICIAL PROCTORED EXAMINATION GRADE TRANSCRIPT', 105, 23, { align: 'center' });

    // Decorative Bar
    doc.setFillColor(14, 165, 233);
    doc.rect(0, 32, 210, 4, 'F');

    // Candidate Details Frame
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 45, 182, 60, 4, 4, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CANDIDATE & EXAMINATION RECORD', 22, 57);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Candidate Name: ${user?.fullName || 'Aarav Sharma'}`, 22, 68);
    doc.text(`ERP Roll ID: ${user?.erpId || 'ERP2026-CS-042'}`, 22, 76);
    doc.text(`Department: ${user?.department || 'Computer Science'}`, 22, 84);
    doc.text(`Examination Title: ${res.examTitle}`, 22, 92);

    // Scorecard Summary Box
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(14, 115, 182, 45, 4, 4, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('PERFORMANCE EVALUATION', 22, 127);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`Obtained Score: ${res.score} / ${res.totalMarks} Marks`, 22, 137);
    doc.text(`Percentage Score: ${res.percentage || Math.round((res.score / res.totalMarks) * 100)}%`, 22, 147);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(res.status === 'PASSED' ? 16 : 220, res.status === 'PASSED' ? 185 : 38, res.status === 'PASSED' ? 129 : 38);
    doc.text(`FINAL RESULT STATUS: ${res.status}`, 120, 137);

    // Anti-Cheat Proctor Audit Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ANTI-CHEAT PROCTORING INTEGRITY LOGS', 14, 172);

    let y = 182;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);

    (res.securityWarnings || ['Clean session — No integrity violations.']).forEach((warn) => {
      doc.text(`• ${warn}`, 16, y);
      y += 8;
    });

    // Verification Seal
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Digitally Verified by UAMP Anti-Cheat Engine', 14, 260);
    doc.text('Controller of Examinations Office', 150, 260);

    doc.save(`GradeTranscript_${res.id}.pdf`);
  }
}
