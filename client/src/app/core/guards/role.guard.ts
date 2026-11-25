import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'] as UserRole;
  const user = authService.currentUser();

  if (user) {
    if (user.role === expectedRole) {
      return true;
    }
    authService.redirectBasedOnRole(user.role);
    return false;
  }

  if (authService.getToken()) {
    return authService.loadCurrentUser().pipe(
      map(loadedUser => {
        if (loadedUser && loadedUser.role === expectedRole) {
          return true;
        }
        if (loadedUser) {
          authService.redirectBasedOnRole(loadedUser.role);
        } else {
          router.navigate(['/login']);
        }
        return false;
      })
    );
  }

  router.navigate(['/login']);
  return false;
};
