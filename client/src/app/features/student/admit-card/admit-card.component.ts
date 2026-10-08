import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmitCardService } from '../../../core/services/admit-card.service';
import { AdmitCard } from '../../../core/models/admit-card.model';

@Component({
  selector: 'app-student-admit-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Official Examination Hall Ticket</h1>
          <p class="text-xs text-slate-500">Admit Card verification & client-side PDF document generation</p>
        </div>

        <span *ngIf="card" [ngClass]="card.status === 'RELEASED' ? 'badge-success' : 'badge-danger'" class="badge text-xs px-3 py-1">
          <i [class]="card.status === 'RELEASED' ? 'fa-solid fa-circle-check' : 'fa-solid fa-lock'"></i>
          {{ card.status === 'RELEASED' ? 'HALL TICKET RELEASED' : 'ADMIT CARD BLOCKED / ON HOLD' }}
        </span>
      </div>

      <!-- Admit Card Preview Box -->
      <div *ngIf="card" class="uamp-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        <!-- Top Status Banner -->
        <div *ngIf="card.status === 'BLOCKED'" class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-3">
          <i class="fa-solid fa-triangle-exclamation text-xl shrink-0"></i>
          <div>
            <h4 class="font-bold">Hall Ticket Issuance Blocked</h4>
            <p class="text-[11px] opacity-90 mt-0.5">{{ card.remarks || 'Pending fee clearance or administrative approval.' }}</p>
          </div>
        </div>

        <div *ngIf="card.status === 'RELEASED'" class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-certificate text-xl shrink-0"></i>
            <div>
              <h4 class="font-bold">Admit Card Verified & Cleared</h4>
              <p class="text-[11px] opacity-90 mt-0.5">Approved by Controller of Examinations & Accounts Branch.</p>
            </div>
          </div>
          <button (click)="downloadPdf()" class="btn btn-success btn-sm font-bold shadow-md">
            <i class="fa-solid fa-file-pdf"></i> Download Official PDF
          </button>
        </div>

        <!-- Hall Ticket Layout Frame -->
        <div class="border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/40 space-y-6">
          
          <!-- Header Banner -->
          <div class="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>
              <div>
                <h2 class="text-base font-extrabold text-slate-900 dark:text-white font-heading">UNIVERSITY ASSESSMENT PORTAL</h2>
                <p class="text-xs text-slate-500">Hall Ticket for End-Semester Examinations 2026</p>
              </div>
            </div>
            <div class="text-right font-mono text-xs text-slate-500">
              <p>Issue Date: {{ card.issueDate }}</p>
              <p class="font-bold text-indigo-600 dark:text-indigo-400">STATUS: {{ card.status }}</p>
            </div>
          </div>

          <!-- Student Profile Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="sm:col-span-2 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span class="text-slate-400 block font-semibold text-[10px] uppercase">Candidate Name</span>
                <span class="text-sm font-extrabold text-slate-900 dark:text-white">{{ card.studentName }}</span>
              </div>
              <div>
                <span class="text-slate-400 block font-semibold text-[10px] uppercase">ERP Roll Number</span>
                <span class="text-sm font-extrabold text-slate-900 dark:text-white font-mono">{{ card.erpId }}</span>
              </div>
              <div>
                <span class="text-slate-400 block font-semibold text-[10px] uppercase">Department</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">{{ card.department }}</span>
              </div>
              <div>
                <span class="text-slate-400 block font-semibold text-[10px] uppercase">Academic Year</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">{{ card.year }}</span>
              </div>
            </div>

            <!-- Candidate Photo Frame -->
            <div class="flex flex-col items-center justify-center p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950">
              <div class="w-20 h-24 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-xs font-mono mb-1">
                <i class="fa-solid fa-user text-3xl"></i>
              </div>
              <span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">BIOMETRIC VERIFIED</span>
            </div>
          </div>

          <!-- Exam Schedule Table -->
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Approved Examination Subjects</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead class="bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <tr>
                    <th class="p-2.5">Code</th>
                    <th class="p-2.5">Subject Name</th>
                    <th class="p-2.5">Date</th>
                    <th class="p-2.5">Session</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td class="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">CS301</td>
                    <td class="p-2.5 font-semibold text-slate-900 dark:text-white">Database Management Systems</td>
                    <td class="p-2.5">2026-10-15</td>
                    <td class="p-2.5">10:00 AM</td>
                  </tr>
                  <tr>
                    <td class="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">CS302</td>
                    <td class="p-2.5 font-semibold text-slate-900 dark:text-white">Artificial Intelligence & ML</td>
                    <td class="p-2.5">2026-10-07</td>
                    <td class="p-2.5">02:00 PM</td>
                  </tr>
                  <tr>
                    <td class="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">CS303</td>
                    <td class="p-2.5 font-semibold text-slate-900 dark:text-white">Computer Networks & Security</td>
                    <td class="p-2.5">2026-10-20</td>
                    <td class="p-2.5">11:00 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Download Footer Control -->
        <div class="flex items-center justify-end">
          <button (click)="downloadPdf()" [disabled]="card.status === 'BLOCKED'" 
                  [ngClass]="card.status === 'BLOCKED' ? 'btn-outline opacity-40 cursor-not-allowed' : 'btn-primary'"
                  class="btn py-3 px-6 font-bold shadow-lg">
            <i class="fa-solid fa-file-pdf"></i>
            <span>{{ card.status === 'BLOCKED' ? 'Download Disabled (Fee Dues Pending)' : 'Download Hall Ticket PDF' }}</span>
          </button>
        </div>

      </div>

    </div>
  `
})
export class AdmitCardComponent implements OnInit {
  admitCardService = inject(AdmitCardService);
  card: AdmitCard | null = null;

  ngOnInit(): void {
    this.admitCardService.getMyAdmitCard().subscribe(res => {
      this.card = res;
    });
  }

  downloadPdf(): void {
    if (this.card && this.card.status === 'RELEASED') {
      this.admitCardService.generateAdmitCardPdf(this.card);
    }
  }
}
