import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdmitCardService } from '../../../core/services/admit-card.service';
import { AdmitCard } from '../../../core/models/admit-card.model';

@Component({
  selector: 'app-admin-manage-admit-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Manage Hall Tickets & Admit Cards</h1>
          <p class="text-xs text-slate-500">Block or release examination hall tickets for candidates</p>
        </div>

        <!-- Filter Input -->
        <div class="w-full sm:w-64">
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search by name, ERP, dept..." class="form-control">
        </div>
      </div>

      <!-- Admit Cards Table -->
      <div class="uamp-card">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-3">Student Name</th>
                <th class="p-3">ERP Roll ID</th>
                <th class="p-3">Department & Year</th>
                <th class="p-3">Remarks / Dues</th>
                <th class="p-3">Admit Card Status</th>
                <th class="p-3 text-right">Status Action Toggle</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let card of filteredCards()" class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td class="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                    {{ card.studentName?.charAt(0) || 'S' }}
                  </div>
                  {{ card.studentName }}
                </td>
                <td class="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ card.erpId }}</td>
                <td class="p-3 font-medium">{{ card.department }} ({{ card.year }})</td>
                <td class="p-3 text-slate-500 max-w-xs truncate">{{ card.remarks || 'Standard Clearance' }}</td>
                
                <!-- Status Badge -->
                <td class="p-3">
                  <span [ngClass]="card.status === 'RELEASED' ? 'badge-success' : 'badge-danger'" class="badge">
                    <i [class]="card.status === 'RELEASED' ? 'fa-solid fa-circle-check' : 'fa-solid fa-lock'"></i>
                    {{ card.status }}
                  </span>
                </td>

                <!-- Action Button Toggle -->
                <td class="p-3 text-right">
                  <button *ngIf="card.status === 'BLOCKED'" 
                          (click)="toggleStatus(card, 'RELEASED')" 
                          class="btn btn-success btn-sm text-[11px] font-bold shadow-sm">
                    <i class="fa-solid fa-lock-open"></i> Release Admit Card
                  </button>

                  <button *ngIf="card.status === 'RELEASED'" 
                          (click)="toggleStatus(card, 'BLOCKED')" 
                          class="btn btn-danger btn-sm text-[11px] font-bold shadow-sm">
                    <i class="fa-solid fa-ban"></i> Block Admit Card
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class ManageAdmitCardsComponent implements OnInit {
  admitCardService = inject(AdmitCardService);

  cards: AdmitCard[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.admitCardService.getAllAdmitCards().subscribe(res => {
      this.cards = res;
    });
  }

  filteredCards(): AdmitCard[] {
    if (!this.searchTerm) return this.cards;
    const term = this.searchTerm.toLowerCase();
    return this.cards.filter(c => 
      (c.studentName || '').toLowerCase().includes(term) ||
      (c.erpId || '').toLowerCase().includes(term) ||
      (c.department || '').toLowerCase().includes(term)
    );
  }

  toggleStatus(card: AdmitCard, newStatus: 'BLOCKED' | 'RELEASED'): void {
    const remark = newStatus === 'RELEASED' ? 'Approved by Administrator.' : 'Blocked by Administrator due to fee verification.';
    this.admitCardService.updateAdmitCardStatus(card.studentId, newStatus, remark).subscribe(() => {
      card.status = newStatus;
      card.remarks = remark;
    });
  }
}
