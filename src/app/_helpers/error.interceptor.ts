import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

const PUBLIC_URLS = [
  '/authenticate',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/refresh-token',
];

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        const isPublicRoute = PUBLIC_URLS.some(url => request.url.includes(url));

        // Only auto-logout on 401/403 for protected routes when user is logged in
        if ([401, 403].includes(err.status) && this.accountService.accountValue && !isPublicRoute) {
          this.accountService.logout();
        }

        // Extract the most useful error message
        const error = err.error?.message || err.error?.error || err.message || err.statusText || 'An error occurred';
        return throwError(() => error);
      })
    );
  }
}