import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeeService } from '../../../core/services/fee.service';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { Fee } from '../../../core/models/fee.model';

@Component({
  selector: 'app-admin-fees',
  standalone: true,
  imports: [CommonModule, FormsModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Fee Amount Editing & Accounts Approval</h1>
          <p class="text-xs text-slate-500">Edit student tuition fee balances and approve/disapprove payment receipts</p>
        </div>
      </div>

      <!-- Fees Table -->
      <div class="uamp-card">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-3">Student Name</th>
                <th class="p-3">ERP ID</th>
                <th class="p-3">Total Fee</th>
                <th class="p-3">Paid Amount</th>
                <th class="p-3">Payment Status</th>
                <th class="p-3">Accounts Approval</th>
                <th class="p-3 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let fee of fees" class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td class="p-3 font-bold text-slate-900 dark:text-white">{{ fee.studentName }}</td>
                <td class="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ fee.erpId }}</td>
                
                <!-- Total Amount Cell / Edit Mode -->
                <td class="p-3 font-semibold">
                  <span *ngIf="editingStudentId !== fee.studentId">{{ fee.totalAmount | inrCurrency }}</span>
                  <input *ngIf="editingStudentId === fee.studentId" type="number" [(ngModel)]="editTotalAmount" class="w-24 form-control py-1 text-xs">
                </td>

                <!-- Paid Amount Cell / Edit Mode -->
                <td class="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                  <span *ngIf="editingStudentId !== fee.studentId">{{ fee.paidAmount | inrCurrency }}</span>
                  <input *ngIf="editingStudentId === fee.studentId" type="number" [(ngModel)]="editPaidAmount" class="w-24 form-control py-1 text-xs">
                </td>

                <!-- Status Badge -->
                <td class="p-3">
                  <span [ngClass]="{
                    'badge-success': fee.status === 'PAID',
                    'badge-warning': fee.status === 'PARTIAL',
                    'badge-danger': fee.status === 'PENDING'
                  }" class="badge">
                    {{ fee.status }}
                  </span>
                </td>

                <!-- Approval Status Badge -->
                <td class="p-3">
                  <span [ngClass]="{
                    'badge-success': fee.approvalStatus === 'APPROVED',
                    'badge-warning': fee.approvalStatus === 'PENDING',
                    'badge-danger': fee.approvalStatus === 'DISAPPROVED'
                  }" class="badge">
                    {{ fee.approvalStatus }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="p-3 text-right space-x-1 whitespace-nowrap">
                  <!-- Edit Amount Controls -->
                  <ng-container *ngIf="editingStudentId !== fee.studentId">
                    <button (click)="startEditing(fee)" class="btn btn-outline btn-sm text-[11px]" title="Edit Amounts">
                      <i class="fa-solid fa-pen"></i> Edit
                    </button>
                  </ng-container>

                  <ng-container *ngIf="editingStudentId === fee.studentId">
                    <button (click)="saveAmounts(fee)" class="btn btn-success btn-sm text-[11px]">
                      <i class="fa-solid fa-check"></i> Save
                    </button>
                    <button (click)="cancelEditing()" class="btn btn-outline btn-sm text-[11px]">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </ng-container>

                  <!-- Approval Toggle Controls -->
                  <button *ngIf="fee.approvalStatus !== 'APPROVED'" (click)="setApproval(fee, 'APPROVED')" class="btn btn-success btn-sm text-[11px]">
                    <i class="fa-solid fa-circle-check"></i> Approve
                  </button>

                  <button *ngIf="fee.approvalStatus !== 'DISAPPROVED'" (click)="setApproval(fee, 'DISAPPROVED')" class="btn btn-danger btn-sm text-[11px]">
                    <i class="fa-solid fa-circle-xmark"></i> Reject
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
export class AdminFeesComponent implements OnInit {
  feeService = inject(FeeService);

  fees: Fee[] = [];
  editingStudentId: string | null = null;
  editTotalAmount: number = 0;
  editPaidAmount: number = 0;

  ngOnInit(): void {
    this.loadFees();
  }

  loadFees(): void {
    this.feeService.getAllFees().subscribe(res => {
      this.fees = res;
    });
  }

  startEditing(fee: Fee): void {
    this.editingStudentId = fee.studentId;
    this.editTotalAmount = fee.totalAmount;
    this.editPaidAmount = fee.paidAmount;
  }

  cancelEditing(): void {
    this.editingStudentId = null;
  }

  saveAmounts(fee: Fee): void {
    this.feeService.editFee(fee.studentId, this.editTotalAmount, this.editPaidAmount).subscribe(updated => {
      fee.totalAmount = updated.totalAmount;
      fee.paidAmount = updated.paidAmount;
      fee.status = updated.status;
      this.editingStudentId = null;
    });
  }

  setApproval(fee: Fee, status: 'APPROVED' | 'DISAPPROVED'): void {
    this.feeService.approveFee(fee.id, status).subscribe(updated => {
      fee.approvalStatus = updated.approvalStatus;
    });
  }
}
