import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'] as UserRole;
  const user = authService.currentUser();

  if (user && user.role === expectedRole) {
    return true;
  }

  if (user) {
    authService.redirectBasedOnRole(user.role);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
