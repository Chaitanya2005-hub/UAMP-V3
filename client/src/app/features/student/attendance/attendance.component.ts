import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../core/services/attendance.service';
import { Attendance } from '../../../core/models/attendance.model';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Live Dynamic QR Attendance</h1>
          <p class="text-xs text-slate-500">Scan lecture QR code or enter active 4-digit host PIN</p>
        </div>
        <span class="badge badge-success flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Host Receiver Online
        </span>
      </div>

      <!-- Mark Attendance Card -->
      <div class="uamp-card p-6 sm:p-8 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Method 1: 4-Digit PIN Entry -->
          <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center text-lg font-bold">
                <i class="fa-solid fa-key"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">4-Digit Dynamic Code</h3>
                <p class="text-xs text-slate-500">Enter pin displayed on host screen</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Enter Host Code</label>
              <input type="text" [(ngModel)]="pinCode" maxlength="4" placeholder="e.g. 8492"
                     class="w-full text-center text-2xl font-mono tracking-widest py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-extrabold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <button (click)="submitPin()" [disabled]="!pinCode || pinCode.length !== 4 || isLoading" 
                    class="w-full btn btn-primary py-3 font-bold disabled:opacity-40">
              <i *ngIf="isLoading" class="fa-solid fa-spinner animate-spin"></i>
              <span>Mark Attendance Now</span>
            </button>
          </div>

          <!-- Method 2: QR Scanner Simulator -->
          <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center text-lg font-bold">
                <i class="fa-solid fa-qrcode"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">QR Code Scanner</h3>
                <p class="text-xs text-slate-500">Point mobile camera or upload QR image</p>
              </div>
            </div>

            <div class="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-2 bg-white dark:bg-slate-950">
              <i class="fa-solid fa-camera text-3xl text-slate-400"></i>
              <p class="text-xs text-slate-500">Ready to scan live dynamic QR token</p>
              <button (click)="simulatedQrScan()" class="btn btn-outline btn-sm mx-auto">
                <i class="fa-solid fa-bolt text-amber-500"></i> Simulate QR Scan
              </button>
            </div>
          </div>

        </div>

        <!-- Success / Error Alerts -->
        <div *ngIf="feedbackMessage" [ngClass]="isSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'" 
             class="p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <i [class]="isSuccess ? 'fa-solid fa-circle-check text-base' : 'fa-solid fa-circle-exclamation text-base'"></i>
          <span>{{ feedbackMessage }}</span>
        </div>

      </div>

      <!-- Attendance History Log -->
      <div class="uamp-card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">My Attendance History</h2>
          <span class="text-xs font-semibold text-slate-500">{{ history.length }} Records Found</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-3">Date</th>
                <th class="p-3">Time</th>
                <th class="p-3">Lecture / Subject</th>
                <th class="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let rec of history" class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td class="p-3 font-semibold text-slate-900 dark:text-white">{{ rec.date }}</td>
                <td class="p-3">{{ rec.time || '09:15 AM' }}</td>
                <td class="p-3 font-medium">{{ rec.subject || 'DBMS Lecture' }}</td>
                <td class="p-3 text-right">
                  <span [ngClass]="rec.status === 'PRESENT' ? 'badge-success' : 'badge-danger'" class="badge">
                    {{ rec.status }}
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
export class AttendanceComponent implements OnInit {
  attendanceService = inject(AttendanceService);

  pinCode: string = '';
  isLoading: boolean = false;
  feedbackMessage: string = '';
  isSuccess: boolean = false;
  history: Attendance[] = [];

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.attendanceService.getMyAttendanceHistory().subscribe(res => {
      this.history = res;
    });
  }

  submitPin(): void {
    this.isLoading = true;
    this.feedbackMessage = '';

    this.attendanceService.markStudentAttendance(this.pinCode).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.feedbackMessage = res.message || 'Attendance marked successfully!';
        this.pinCode = '';
        this.loadHistory();
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.feedbackMessage = err.error?.message || 'Invalid or expired QR code/PIN.';
      }
    });
  }

  simulatedQrScan(): void {
    this.attendanceService.getTeacherQrCode().subscribe(live => {
      this.pinCode = live.code;
      this.submitPin();
    });
  }
}
