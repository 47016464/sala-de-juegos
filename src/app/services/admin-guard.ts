import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from './auth.service';

export const adminGuard:
CanActivateFn = async () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  const user =
    await authService.getUser();

  const esAdmin =
    user?.email ===
    'augusebottazzi@gmail.com';

  if (esAdmin) {

    return true;

  }

  router.navigate(['/home']);

  return false;

};