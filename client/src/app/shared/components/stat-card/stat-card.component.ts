import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="uamp-card relative overflow-hidden group">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{{ title }}</p>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ value }}</h3>
          <p *ngIf="subtitle" class="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span *ngIf="trend" [ngClass]="trend === 'up' ? 'text-emerald-500' : 'text-rose-500'">
              <i [class]="trend === 'up' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
            </span>
            {{ subtitle }}
          </p>
        </div>
        <div [ngClass]="iconBgClass" class="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 shadow-sm">
          <i [class]="iconClass"></i>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string;
  @Input() iconClass: string = 'fa-solid fa-chart-line';
  @Input() iconBgClass: string = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400';
  @Input() trend?: 'up' | 'down';
}
