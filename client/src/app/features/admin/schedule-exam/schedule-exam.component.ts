import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { Subject } from '../../../core/models/subject.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-schedule-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-3xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Schedule New Proctored Exam</h1>
          <p class="text-xs text-slate-500">Configure proctored exam parameters, subject code, and session time</p>
        </div>
      </div>

      <!-- Schedule Exam Form Card -->
      <div class="uamp-card p-6 sm:p-8 space-y-6">
        
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Exam Title</label>
            <input type="text" [(ngModel)]="title" name="title" required class="form-control" placeholder="e.g. Artificial Intelligence Mid-Sem Proctored Test">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Subject</label>
              <select [(ngModel)]="subjectId" name="subjectId" class="form-control">
                <option *ngFor="let s of subjects" [value]="s.id">{{ s.name }} ({{ s.code }})</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Duration (Minutes)</label>
              <input type="number" [(ngModel)]="durationMinutes" name="durationMinutes" required class="form-control">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Examination Date</label>
              <input type="date" [(ngModel)]="examDate" name="examDate" required class="form-control">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Start Session Time</label>
              <input type="text" [(ngModel)]="startTime" name="startTime" required class="form-control" placeholder="e.g. 10:00 AM">
            </div>
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="!title || isLoading" class="btn btn-primary font-bold shadow-lg">
              <i *ngIf="isLoading" class="fa-solid fa-spinner animate-spin"></i>
              <i *ngIf="!isLoading" class="fa-solid fa-calendar-check"></i>
              <span>Schedule & Publish Exam</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  `
})
export class ScheduleExamComponent implements OnInit {
  examService = inject(ExamService);
  http = inject(HttpClient);
  router = inject(Router);

  title: string = '';
  subjectId: string = 'sub-1';
  durationMinutes: number = 60;
  examDate: string = new Date().toISOString().split('T')[0];
  startTime: string = '10:00 AM';

  subjects: Subject[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.http.get<Subject[]>('http://localhost:3000/api/subjects').subscribe(res => {
      this.subjects = res;
      if (this.subjects.length > 0) this.subjectId = this.subjects[0].id;
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.examService.scheduleExam({
      title: this.title,
      subjectId: this.subjectId,
      durationMinutes: this.durationMinutes,
      examDate: this.examDate,
      startTime: this.startTime
    }).subscribe(() => {
      this.isLoading = false;
      this.router.navigate(['/admin/dashboard']);
    });
  }
}
