import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeService } from '../../../core/services/fee.service';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { Fee } from '../../../core/models/fee.model';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-student-fee-details',
  standalone: true,
  imports: [CommonModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Tuition Fee & Payment Status</h1>
          <p class="text-xs text-slate-500">Semester fee breakdown and accounts clearance verification</p>
        </div>

        <button (click)="downloadReceipt()" [disabled]="!fee || fee.paidAmount === 0" 
                class="btn btn-primary btn-sm font-bold shadow-md disabled:opacity-40">
          <i class="fa-solid fa-file-invoice"></i> Download Fee Receipt PDF
        </button>
      </div>

      <!-- Fee Card Summary -->
      <div *ngIf="fee" class="uamp-card p-6 sm:p-8 space-y-6">
        
        <!-- Status Header Badges -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Academic Session 2026</span>
            <h2 class="text-xl font-extrabold text-slate-900 dark:text-white font-heading">Semester Tuition & Exam Fees</h2>
          </div>

          <div class="flex items-center gap-2">
            <span [ngClass]="{
              'badge-success': fee.status === 'PAID',
              'badge-warning': fee.status === 'PARTIAL',
              'badge-danger': fee.status === 'PENDING'
            }" class="badge text-xs px-3 py-1">
              {{ fee.status }} PAYMENT
            </span>

            <span [ngClass]="{
              'badge-success': fee.approvalStatus === 'APPROVED',
              'badge-warning': fee.approvalStatus === 'PENDING',
              'badge-danger': fee.approvalStatus === 'DISAPPROVED'
            }" class="badge text-xs px-3 py-1">
              ACCOUNTS: {{ fee.approvalStatus }}
            </span>
          </div>
        </div>

        <!-- 3 Metric Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span class="text-[11px] font-bold text-slate-400 uppercase">Total Required Amount</span>
            <p class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{{ fee.totalAmount | inrCurrency }}</p>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Paid Amount Cleared</span>
            <p class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{{ fee.paidAmount | inrCurrency }}</p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span class="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">Outstanding Dues Balance</span>
            <p class="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{{ (fee.totalAmount - fee.paidAmount) | inrCurrency }}</p>
          </div>
        </div>

        <!-- Payment Transaction Details -->
        <div class="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Latest Payment Transaction Record</h3>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span class="text-slate-400 block font-semibold text-[10px]">Transaction ID</span>
              <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ fee.transactionId || 'TXN-N/A' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block font-semibold text-[10px]">Payment Date</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ fee.paymentDate || '2026-09-15' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block font-semibold text-[10px]">Accounts Clearance</span>
              <span class="font-bold text-emerald-500">{{ fee.approvalStatus }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class FeeDetailsComponent implements OnInit {
  feeService = inject(FeeService);
  fee: Fee | null = null;

  ngOnInit(): void {
    this.feeService.getMyFeeStatus().subscribe(res => {
      this.fee = res;
    });
  }

  downloadReceipt(): void {
    if (!this.fee) return;
    const doc = new jsPDF();

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('UNIVERSITY ASSESSMENT & MASTERY PORTAL', 105, 14, { align: 'center' });
    doc.setFontSize(10);
    doc.text('OFFICIAL TUITION FEE PAYMENT RECEIPT', 105, 22, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text(`Transaction Reference: ${this.fee.transactionId || 'TXN-998811'}`, 20, 45);
    doc.text(`Payment Date: ${this.fee.paymentDate || '2026-09-15'}`, 20, 53);
    doc.text(`Student ERP: ${this.fee.erpId || 'ERP2026-CS-042'}`, 20, 61);
    doc.text(`Student Name: ${this.fee.studentName || 'Student Name'}`, 20, 69);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 77, 190, 77);

    doc.text(`Total Semester Fee: Rs. ${this.fee.totalAmount}`, 20, 90);
    doc.text(`Amount Paid: Rs. ${this.fee.paidAmount}`, 20, 98);
    doc.text(`Balance Dues: Rs. ${this.fee.totalAmount - this.fee.paidAmount}`, 20, 106);
    doc.text(`Payment Status: ${this.fee.status}`, 20, 114);
    doc.text(`Approval Status: ${this.fee.approvalStatus}`, 20, 122);

    doc.save(`FeeReceipt_${this.fee.erpId || 'Student'}.pdf`);
  }
}
