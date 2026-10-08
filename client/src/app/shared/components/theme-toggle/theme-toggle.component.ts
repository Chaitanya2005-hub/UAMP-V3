import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="themeService.toggleTheme()" 
      class="p-2.5 rounded-full transition-all duration-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
      [title]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
      <i *ngIf="!themeService.isDarkMode()" class="fa-solid fa-moon text-indigo-600 text-lg"></i>
      <i *ngIf="themeService.isDarkMode()" class="fa-solid fa-sun text-amber-400 text-lg"></i>
    </button>
  `
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
