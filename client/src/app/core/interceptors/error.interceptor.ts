import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthAction = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/verify-otp-register');
      if ((error.status === 401 || error.status === 403) && !isAuthAction) {
        console.warn('Authentication token expired or forbidden:', error.message);
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
