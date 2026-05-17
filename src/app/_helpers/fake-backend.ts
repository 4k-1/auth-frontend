import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

const ACCOUNTS_KEY = 'fake-backend-accounts';

function getAccounts(): any[] {
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
}

function setAccounts(accounts: any[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = request;
    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/accounts/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/accounts/register') && method === 'POST':
          return register();
        case url.endsWith('/accounts/verify-email') && method === 'POST':
          return verifyEmail();
        case url.endsWith('/accounts/refresh-token') && method === 'POST':
          return refreshToken();
        case url.endsWith('/accounts/revoke-token') && method === 'POST':
          return ok({ message: 'Token revoked' });
        case url.endsWith('/accounts/forgot-password') && method === 'POST':
          return forgotPassword();
        case url.endsWith('/accounts/reset-password') && method === 'POST':
          return resetPassword();
        case url.endsWith('/accounts') && method === 'GET':
          return getAll();
        case url.match(/\/accounts\/\d+$/) && method === 'GET':
          return getById();
        case url.match(/\/accounts\/\d+$/) && method === 'PUT':
          return updateAccount();
        case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
          return deleteAccount();
        default:
          return next.handle(request);
      }
    }

    function authenticate() {
      const { email, password } = body;
      const accounts = getAccounts();
      const account = accounts.find((x: any) => x.email === email && x.password === password);

      if (!account) return error('Invalid email or password');
      if (!account.isVerified) return error('Please verify your email first');

      return ok({
        ...basicDetails(account),
        jwtToken: `fake-jwt-token.${account.id}.${account.role}`,
      });
    }

    function register() {
      const params = body;
      const accounts = getAccounts();

      if (accounts.find((x: any) => x.email === params.email)) {
        return error('Email already registered');
      }

      const account = {
        ...params,
        id: accounts.length ? Math.max(...accounts.map((x: any) => x.id)) + 1 : 1,
        role: accounts.length === 0 ? 'Admin' : 'User',
        isVerified: false,
        verificationToken: `fake-verify-token-${Date.now()}`,
        dateCreated: new Date().toISOString(),
      };

      accounts.push(account);
      setAccounts(accounts);

      // Simulate email alert
      alert(`📧 Fake Backend Email Sent!\n\nVerification Link:\n/account/verify-email?token=${account.verificationToken}\n\nCopy and paste this in the URL to verify.`);

      return ok({ message: 'Registration successful. Please verify your email.', role: account.role });
    }

    function verifyEmail() {
      const { token } = body;
      const accounts = getAccounts();
      const account = accounts.find((x: any) => x.verificationToken === token);

      if (!account) return error('Invalid or expired verification token');

      account.isVerified = true;
      setAccounts(accounts);

      return ok({ message: 'Email verified successfully. You can now log in.' });
    }

    function refreshToken() {
      return ok({ message: 'Refresh token handled by fake backend' });
    }

    function forgotPassword() {
      const { email } = body;
      const accounts = getAccounts();
      const account = accounts.find((x: any) => x.email === email);

      if (account) {
        account.resetToken = `fake-reset-token-${Date.now()}`;
        setAccounts(accounts);
        alert(`📧 Fake Password Reset Email!\n\nReset Link:\n/account/reset-password?token=${account.resetToken}`);
      }

      return ok({ message: 'If that email exists, a reset link has been sent.' });
    }

    function resetPassword() {
      const { token, password } = body;
      const accounts = getAccounts();
      const account = accounts.find((x: any) => x.resetToken === token);

      if (!account) return error('Invalid or expired reset token');

      account.password = password;
      account.resetToken = null;
      setAccounts(accounts);

      return ok({ message: 'Password reset successful.' });
    }

    function getAll() {
      if (!isLoggedIn()) return unauthorized();
      if (!isAdmin()) return forbidden();
      return ok(getAccounts().map(basicDetails));
    }

    function getById() {
      if (!isLoggedIn()) return unauthorized();
      const id = idFromUrl();
      const accounts = getAccounts();
      const account = accounts.find((x: any) => x.id === id);
      if (!account) return error('Account not found');
      if (!isAdmin() && currentUser()?.id !== id) return forbidden();
      return ok(basicDetails(account));
    }

    function updateAccount() {
      if (!isLoggedIn()) return unauthorized();
      const id = idFromUrl();
      const accounts = getAccounts();
      const idx = accounts.findIndex((x: any) => x.id === id);
      if (idx === -1) return error('Account not found');
      if (!isAdmin() && currentUser()?.id !== id) return forbidden();
      accounts[idx] = { ...accounts[idx], ...body };
      setAccounts(accounts);
      return ok({ message: 'Account updated' });
    }

    function deleteAccount() {
      if (!isLoggedIn()) return unauthorized();
      if (!isAdmin()) return forbidden();
      const id = idFromUrl();
      const accounts = getAccounts().filter((x: any) => x.id !== id);
      setAccounts(accounts);
      return ok({ message: 'Account deleted' });
    }

    // Helpers
    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(300));
    }

    function error(message: string) {
      return throwError(() => ({ error: { message } })).pipe(materialize(), delay(300), dematerialize());
    }

    function unauthorized() {
      return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } })).pipe(materialize(), delay(300), dematerialize());
    }

    function forbidden() {
      return throwError(() => ({ status: 403, error: { message: 'Forbidden' } })).pipe(materialize(), delay(300), dematerialize());
    }

    function basicDetails(account: any) {
      return {
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        role: account.role,
        isVerified: account.isVerified,
        createdAt: account.dateCreated,
      };
    }

    function isLoggedIn() {
      const authHeader = request.headers.get('Authorization');
      return authHeader?.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
      const token = request.headers.get('Authorization')?.split('.')[2];
      return token === 'Admin';
    }

    function currentUser() {
      const token = request.headers.get('Authorization');
      if (!token) return null;
      const id = parseInt(token.split('.')[1]);
      return getAccounts().find((x: any) => x.id === id) || null;
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
