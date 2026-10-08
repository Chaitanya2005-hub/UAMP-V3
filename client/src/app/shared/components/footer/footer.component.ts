import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <i class="fa-solid fa-graduation-cap text-indigo-500"></i>
            <span>University Assessment & Mastery Portal &copy; 2026. Enterprise Academic System.</span>
          </div>
          <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Proctoring Engine Online
            </span>
            <span>•</span>
            <span class="hover:text-indigo-500 cursor-pointer">Security Policy</span>
            <span>•</span>
            <span class="hover:text-indigo-500 cursor-pointer">Helpdesk</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
