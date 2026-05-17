import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = window.localStorage.getItem('token');
  const router = inject(Router);
  if (token){
    return true;
  }
    router.navigate(['/auth']);
    return false;
};
