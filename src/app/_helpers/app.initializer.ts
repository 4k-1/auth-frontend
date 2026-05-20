import {catchError, of } from 'rxjs';

import { AccountService } from '../_services/account.service';

export function appInitializer(accountService: AccountService) {
  return () => accountService.refreshToken()
    .pipe(
      catchError(() => {
        // catch error and continue, so that app initializer will not block app initialization
        return of([]);
      })
    )
    
}