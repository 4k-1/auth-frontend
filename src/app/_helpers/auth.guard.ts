import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const account = accountService.accountValue;

  if (account) {
    return true;
  }

  router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const account = accountService.accountValue;

  if (account?.role === 'Admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
