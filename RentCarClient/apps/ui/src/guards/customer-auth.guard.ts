import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthState } from '../pages/services/auth.state';

export const customerAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authState = inject(AuthState);
  if (authState.token()) return true;
  return router.createUrlTree(['/login']);
};
