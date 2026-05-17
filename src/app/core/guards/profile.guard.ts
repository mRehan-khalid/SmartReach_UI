import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const profileGuard: CanActivateFn = (route, state) => {

  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {

    const userData = window.localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
      router.navigate(['/auth']);
      return false;
    }

    if (user.isProfileComplete) {
      return true;
    }

    router.navigate(['/profile']);
    return false;
  }

  return false;
};