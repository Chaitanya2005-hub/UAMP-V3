import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem('uamp_theme');
    if (saved) {
      this.isDarkMode.set(saved === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode.update(val => !val);
    this.applyTheme();
  }

  private applyTheme(): void {
    const dark = this.isDarkMode();
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('uamp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('uamp_theme', 'light');
    }
  }
}
