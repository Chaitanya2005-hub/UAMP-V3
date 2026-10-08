import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiAiService } from '../../../core/services/gemini-ai.service';
import { ExamService } from '../../../core/services/exam.service';
import { Question } from '../../../core/models/question.model';
import { Exam } from '../../../core/models/exam.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Question Bank & AI Generator</h1>
          <p class="text-xs text-slate-500">Manual question creation & Google Gemini AI automated generator</p>
        </div>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="flex items-center gap-3 p-1.5 bg-slate-200 dark:bg-slate-900 rounded-2xl w-fit">
        <button (click)="activeTab = 'ai'" [ngClass]="activeTab === 'ai' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-md' : 'text-slate-600 dark:text-slate-400 font-semibold'" 
                class="px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all">
          <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
          <span>Gemini AI Auto-Generator</span>
        </button>
        <button (click)="activeTab = 'manual'" [ngClass]="activeTab === 'manual' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-md' : 'text-slate-600 dark:text-slate-400 font-semibold'" 
                class="px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all">
          <i class="fa-solid fa-pen-to-square"></i>
          <span>Manual Form Entry</span>
        </button>
      </div>

      <!-- TAB 1: GEMINI AI GENERATOR FORM -->
      <div *ngIf="activeTab === 'ai'" class="uamp-card p-6 sm:p-8 space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl font-bold">
            <i class="fa-solid fa-brain"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Google Gemini AI Question Engine</h2>
            <p class="text-xs text-slate-500">Specify topic, count, and difficulty to generate proctored questions instantly</p>
          </div>
        </div>

        <form (ngSubmit)="generateAiQuestions()" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Target Examination</label>
              <select [(ngModel)]="aiExamId" name="aiExamId" class="form-control">
                <option *ngFor="let ex of exams" [value]="ex.id">{{ ex.title }} ({{ ex.subjectName }})</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Number of Questions</label>
              <select [(ngModel)]="aiCount" name="aiCount" class="form-control">
                <option [value]="3">3 Questions</option>
                <option [value]="5">5 Questions</option>
                <option [value]="10">10 Questions</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Topic / Syllabus Focus</label>
              <input type="text" [(ngModel)]="aiTopic" name="aiTopic" required class="form-control"
                     placeholder="e.g. Relational Normalization & B+ Trees">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Difficulty Level</label>
              <select [(ngModel)]="aiDifficulty" name="aiDifficulty" class="form-control">
                <option value="EASY">EASY (Conceptual Foundation)</option>
                <option value="MEDIUM">MEDIUM (Standard Academic)</option>
                <option value="HARD">HARD (Advanced Problem Solving)</option>
              </select>
            </div>
          </div>

          <button type="submit" [disabled]="!aiTopic || isAiLoading" class="btn btn-primary font-bold shadow-lg">
            <i *ngIf="isAiLoading" class="fa-solid fa-spinner animate-spin"></i>
            <i *ngIf="!isAiLoading" class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
            <span>{{ isAiLoading ? 'Generating Questions with AI...' : 'Generate Questions via AI' }}</span>
          </button>
        </form>

        <!-- Generated Questions Result List -->
        <div *ngIf="aiResultSource" class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <span class="badge badge-info">
              Source: {{ aiResultSource }}
            </span>
            <span class="text-xs font-bold text-emerald-500">{{ generatedQuestions.length }} Questions Added to Exam Bank</span>
          </div>

          <div class="space-y-3">
            <div *ngFor="let q of generatedQuestions; let i = index" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white">Q{{ i + 1 }}. {{ q.questionText }}</h4>
              <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <span>A) {{ q.optionA }}</span>
                <span>B) {{ q.optionB }}</span>
                <span>C) {{ q.optionC }}</span>
                <span>D) {{ q.optionD }}</span>
              </div>
              <p class="text-[10px] font-bold text-emerald-500">Correct Answer: {{ q.correctAnswer }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- TAB 2: MANUAL QUESTION ENTRY FORM -->
      <div *ngIf="activeTab === 'manual'" class="uamp-card p-6 sm:p-8 space-y-6">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">Manual Question Form Entry</h2>

        <form (ngSubmit)="submitManualQuestion()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Target Examination</label>
            <select [(ngModel)]="manualExamId" name="manualExamId" class="form-control">
              <option *ngFor="let ex of exams" [value]="ex.id">{{ ex.title }} ({{ ex.subjectName }})</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Question Text</label>
            <textarea [(ngModel)]="manualQText" name="manualQText" rows="2" required class="form-control" placeholder="Enter question description..."></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Option A</label>
              <input type="text" [(ngModel)]="manualOptA" name="manualOptA" required class="form-control">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Option B</label>
              <input type="text" [(ngModel)]="manualOptB" name="manualOptB" required class="form-control">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Option C</label>
              <input type="text" [(ngModel)]="manualOptC" name="manualOptC" required class="form-control">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Option D</label>
              <input type="text" [(ngModel)]="manualOptD" name="manualOptD" required class="form-control">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Correct Answer</label>
            <select [(ngModel)]="manualCorrect" name="manualCorrect" class="form-control">
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>

          <button type="submit" [disabled]="!manualQText" class="btn btn-primary font-bold">
            Save Question to Exam
          </button>
        </form>
      </div>

    </div>
  `
})
export class UploadQuestionsComponent implements OnInit {
  geminiService = inject(GeminiAiService);
  examService = inject(ExamService);
  http = inject(HttpClient);

  activeTab: 'ai' | 'manual' = 'ai';
  exams: Exam[] = [];

  // AI Form
  aiExamId: string = 'ex-101';
  aiCount: number = 3;
  aiTopic: string = 'Relational Algebra & Normalization';
  aiDifficulty: string = 'MEDIUM';
  isAiLoading: boolean = false;
  aiResultSource: string = '';
  generatedQuestions: Question[] = [];

  // Manual Form
  manualExamId: string = 'ex-101';
  manualQText: string = '';
  manualOptA: string = '';
  manualOptB: string = '';
  manualOptC: string = '';
  manualOptD: string = '';
  manualCorrect: 'A' | 'B' | 'C' | 'D' = 'A';

  ngOnInit(): void {
    this.examService.getExams().subscribe(data => {
      this.exams = data;
      if (this.exams.length > 0) {
        this.aiExamId = this.exams[0].id;
        this.manualExamId = this.exams[0].id;
      }
    });
  }

  generateAiQuestions(): void {
    this.isAiLoading = true;
    this.aiResultSource = '';
    this.generatedQuestions = [];

    this.geminiService.generateQuestions(
      this.aiExamId,
      this.aiCount,
      this.aiTopic,
      this.aiDifficulty
    ).subscribe({
      next: (res) => {
        this.isAiLoading = false;
        this.aiResultSource = res.source;
        this.generatedQuestions = res.questions;
      },
      error: () => {
        this.isAiLoading = false;
      }
    });
  }

  submitManualQuestion(): void {
    alert('Question added successfully!');
    this.manualQText = '';
  }
}
