import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Account } from '../_models/account';
import { Router } from '@angular/router';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
  private accountSubject: BehaviorSubject<Account | null>;
  public account$: Observable<Account | null>;

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('account');
    const parsed = stored ? JSON.parse(stored) : null;
    this.accountSubject = new BehaviorSubject<Account | null>(parsed);
    this.account$ = this.accountSubject.asObservable();
  }

  public get accountValue(): Account | null {
    return this.accountSubject.value;
  }

  login(email: string, password: string): Observable<Account> {
    return this.http.post<Account>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
      .pipe(map(account => {
        localStorage.setItem('account', JSON.stringify(account));
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  logout(): void {
    this.http.post(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
    this.stopRefreshTokenTimer();
    localStorage.removeItem('account');
    this.accountSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(params: any): Observable<any> {
    return this.http.post(`${baseUrl}/register`, params);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${baseUrl}/verify-email`, { token });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${baseUrl}/forgot-password`, { email });
  }

  // ✅ ADDED THIS METHOD
  validateResetToken(token: string): Observable<any> {
    return this.http.post(`${baseUrl}/validate-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
  }

  refreshToken(): Observable<Account> {
    return this.http.post<Account>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
      .pipe(map(account => {
        const current = this.accountValue;
        const updated = { ...current, ...account };
        localStorage.setItem('account', JSON.stringify(updated));
        this.accountSubject.next(updated);
        this.startRefreshTokenTimer();
        return updated;
      }));
  }

  getAll(): Observable<Account[]> {
    return this.http.get<Account[]>(baseUrl);
  }

  getById(id: number): Observable<Account> {
    return this.http.get<Account>(`${baseUrl}/${id}`);
  }

  create(params: any): Observable<any> {
    return this.http.post(baseUrl, params);
  }

  update(id: number, params: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, params)
      .pipe(map(x => {
        if (id === this.accountValue?.id) {
          const updated = { ...this.accountValue, ...params };
          localStorage.setItem('account', JSON.stringify(updated));
          this.accountSubject.next(updated);
        }
        return x;
      }));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(finalize(() => {
        if (id === this.accountValue?.id) {
          this.logout();
        }
      }));
  }

  // Alias methods for profile component compatibility
  getProfile(): Observable<Account> {
    const account = this.accountValue;
    if (!account || !account.id) {
      return this.http.get<Account>(`${baseUrl}/profile`);
    }
    return this.getById(account.id);
  }

  updateProfile(id: string | undefined, params: any): Observable<any> {
    const actualId = id ? parseInt(id) : this.accountValue?.id;
    if (!actualId) {
      throw new Error('No user ID available for profile update');
    }
    return this.update(actualId, params);
  }

  deleteUser(id: string | undefined): Observable<any> {
    const actualId = id ? parseInt(id) : this.accountValue?.id;
    if (!actualId) {
      throw new Error('No user ID available for deletion');
    }
    return this.delete(actualId);
  }

  // JWT refresh timer
  private refreshTokenTimeout?: ReturnType<typeof setTimeout>;

  private startRefreshTokenTimer() {
    const account = this.accountValue;
    if (!account?.jwtToken) return;

    try {
      const jwtBase64 = account.jwtToken.split('.')[1];
      const jwtToken = JSON.parse(atob(jwtBase64));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - 60 * 1000;
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), Math.max(timeout, 0));
    } catch (e) {}
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) clearTimeout(this.refreshTokenTimeout);
  }
}