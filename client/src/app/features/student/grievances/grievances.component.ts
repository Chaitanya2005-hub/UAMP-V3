import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Grievance } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-student-grievances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Academic Grievance Redressal</h1>
          <p class="text-xs text-slate-500">Submit requests for exam technical issues or fee/admit card discrepancies</p>
        </div>
      </div>

      <!-- Submit New Grievance Card -->
      <div class="uamp-card p-6 sm:p-8 space-y-4">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">File New Grievance Ticket</h2>

        <form (ngSubmit)="submitGrievance()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Category</label>
            <select [(ngModel)]="category" name="category" required class="form-control">
              <option value="Admit Card & Fees">Admit Card & Fee Verification</option>
              <option value="Exam Technical Issue">Proctored Examination Technical Issue</option>
              <option value="Attendance Discrepancy">QR Code Attendance Discrepancy</option>
              <option value="General Academic">General Academic Support</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Detailed Description</label>
            <textarea [(ngModel)]="description" name="description" rows="3" required
                      class="form-control" placeholder="Provide full details of your issue..."></textarea>
          </div>

          <div *ngIf="message" class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs">
            {{ message }}
          </div>

          <button type="submit" [disabled]="!description || isLoading" class="btn btn-primary font-bold">
            <i *ngIf="isLoading" class="fa-solid fa-spinner animate-spin"></i>
            <span>Submit Ticket to Dean Office</span>
          </button>
        </form>
      </div>

      <!-- My Grievances History -->
      <div class="uamp-card">
        <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">My Filed Grievances</h2>

        <div class="space-y-3">
          <div *ngFor="let g of grievances" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{{ g.category }}</span>
              <span [ngClass]="g.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'" class="badge">
                {{ g.status }}
              </span>
            </div>
            <p class="text-xs text-slate-800 dark:text-slate-200">{{ g.description }}</p>
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <span>Submitted: {{ g.submittedDate }}</span>
              <span *ngIf="g.resolutionNotes" class="text-emerald-500 font-semibold">Notes: {{ g.resolutionNotes }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class GrievancesComponent implements OnInit {
  http = inject(HttpClient);

  category: string = 'Admit Card & Fees';
  description: string = '';
  isLoading: boolean = false;
  message: string = '';
  grievances: Grievance[] = [];

  ngOnInit(): void {
    this.loadGrievances();
  }

  loadGrievances(): void {
    this.http.get<Grievance[]>('http://localhost:3000/api/grievances').subscribe(res => {
      this.grievances = res;
    });
  }

  submitGrievance(): void {
    this.isLoading = true;
    this.http.post('http://localhost:3000/api/grievances', {
      category: this.category,
      description: this.description
    }).subscribe(() => {
      this.isLoading = false;
      this.message = 'Grievance ticket submitted successfully!';
      this.description = '';
      this.loadGrievances();
    });
  }
}
