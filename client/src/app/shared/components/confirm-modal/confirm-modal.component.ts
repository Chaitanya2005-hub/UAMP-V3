import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div class="flex items-center gap-4 mb-4">
          <div [ngClass]="type === 'danger' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'" 
               class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">
            <i [class]="type === 'danger' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-question'"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ subtitle }}</p>
          </div>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{{ message }}</p>

        <div class="flex items-center justify-end gap-3">
          <button (click)="onCancel()" class="btn btn-outline btn-sm">
            {{ cancelText }}
          </button>
          <button (click)="onConfirm()" [ngClass]="type === 'danger' ? 'btn-danger' : 'btn-primary'" class="btn btn-sm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() subtitle: string = 'Please review before proceeding';
  @Input() message: string = 'Are you sure you want to perform this action?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
