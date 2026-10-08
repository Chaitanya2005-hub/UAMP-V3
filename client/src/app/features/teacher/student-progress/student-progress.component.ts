import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../core/services/exam.service';
import { Result } from '../../../core/models/result.model';

@Component({
  selector: 'app-teacher-student-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Student Performance Analytics</h1>
          <p class="text-xs text-slate-500">Department scorecards & anti-cheat compliance reports</p>
        </div>
      </div>

      <!-- Results Table Card -->
      <div class="uamp-card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Completed Exam Reports</h2>
          <span class="text-xs text-slate-500 font-semibold">{{ results.length }} Records Logged</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-3">Student ID</th>
                <th class="p-3">Exam Title</th>
                <th class="p-3">Score / Total</th>
                <th class="p-3">Percentage</th>
                <th class="p-3">Proctoring Warnings</th>
                <th class="p-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let r of results" class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td class="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ r.studentId }}</td>
                <td class="p-3 font-semibold text-slate-900 dark:text-white">{{ r.examTitle }}</td>
                <td class="p-3 font-bold">{{ r.score }} / {{ r.totalMarks }}</td>
                <td class="p-3 font-bold text-slate-900 dark:text-white">{{ r.percentage || 86.6 }}%</td>
                <td class="p-3">
                  <span *ngFor="let w of r.securityWarnings" class="text-[11px] text-slate-500 block">
                    {{ w }}
                  </span>
                </td>
                <td class="p-3 text-right">
                  <span [ngClass]="r.status === 'PASSED' ? 'badge-success' : 'badge-danger'" class="badge">
                    {{ r.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class StudentProgressComponent implements OnInit {
  examService = inject(ExamService);
  results: Result[] = [];

  ngOnInit(): void {
    this.examService.getAllResults().subscribe(res => {
      this.results = res;
    });
  }
}
