import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private router = inject(Router);
  private ngZone = inject(NgZone);

  // 10 minutes in milliseconds (10 * 60 * 1000 = 600000ms)
  private readonly INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;
  private timer: any;
  private isTracking = false;
  private onLogoutCallback: (() => void) | null = null;

  private activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  private boundResetTimer = () => this.resetTimer();

  startTracking(onInactivityLogout: () => void): void {
    if (this.isTracking) return;
    this.isTracking = true;
    this.onLogoutCallback = onInactivityLogout;

    this.ngZone.runOutsideAngular(() => {
      this.activityEvents.forEach(event => {
        window.addEventListener(event, this.boundResetTimer, { passive: true });
      });
    });

    this.resetTimer();
  }

  stopTracking(): void {
    if (!this.isTracking) return;
    this.isTracking = false;
    this.onLogoutCallback = null;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.activityEvents.forEach(event => {
      window.removeEventListener(event, this.boundResetTimer);
    });
  }

  private resetTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.ngZone.run(() => {
        const callback = this.onLogoutCallback;
        this.stopTracking();
        if (callback) {
          callback();
        }
      });
    }, this.INACTIVITY_TIMEOUT_MS);
  }
}
