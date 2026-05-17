import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/account';

@Component({
  templateUrl: './admin.component.html',
  styles: [`
    .admin-container { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; }
    .admin-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem; }
    .admin-badge { display: inline-block; background: #fffbf0; border: 1px solid #f59e0b44;
                   color: #f59e0b; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; }
    h1 { color: #333; font-size: 1.8rem; font-weight: 800; margin: 0 0 0.3rem; }
    p { color: #666; font-size: 0.875rem; margin: 0; }
    .stats { display: flex; gap: 1.5rem; }
    .stat { background: white; border: 1px solid #ddd; border-radius: 10px; padding: 1rem 1.5rem; text-align: center; }
    .stat-num { display: block; font-size: 1.8rem; font-weight: 800; color: #0066cc; }
    .stat-label { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .table-container { background: white; border: 1px solid #ddd; border-radius: 12px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { border-bottom: 1px solid #ddd; }
    th { padding: 0.875rem 1rem; text-align: left; color: #666; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 0.875rem 1rem; border-bottom: 1px solid #f0f0f0; font-size: 0.875rem; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #f9f9f9; }
    .id-cell { color: #0066cc; font-family: monospace; }
    .name-cell { color: #333; font-weight: 500; }
    .email-cell { color: #666; }
    .date-cell { color: #666; }
    .badge { background: #f0f0f0; color: #666; padding: 3px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; }
    .admin-badge-pill { background: #fffbf0; color: #f59e0b; border: 1px solid #f59e0b44; }
    .status-badge { padding: 3px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; }
    .status-badge.verified { background: #e8f5e9; color: #2e7d32; }
    .status-badge.unverified { background: #ffebee; color: #d32f2f; }
    .btn-delete { background: none; border: 1px solid #ffcdd2; color: #d32f2f; padding: 4px 12px;
                  border-radius: 6px; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; }
    .btn-delete:hover:not(:disabled) { background: #ffebee; }
    .btn-delete:disabled { opacity: 0.4; cursor: not-allowed; }
    .error-msg { background: #ffebee; border: 1px solid #ffcdd2; color: #d32f2f; border-radius: 8px; padding: 12px 16px; margin-bottom: 1.5rem; font-size: 0.875rem; }
    .loading-state, .empty { text-align: center; padding: 3rem; color: #666; }
  `]
})
export class AdminComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error = '';

  constructor(private accountService: AccountService) {}

  ngOnInit() { this.loadAccounts(); }

  loadAccounts() {
    this.loading = true;
    this.accountService.getAll().subscribe({
      next: accounts => { this.accounts = accounts; this.loading = false; },
      error: err => { this.error = err; this.loading = false; }
    });
  }

  get adminCount() { return this.accounts.filter(a => a.role === 'Admin').length; }
  get verifiedCount() { return this.accounts.filter(a => a.isVerified).length; }

  isCurrentUser(account: Account) {
    return account.id === this.accountService.accountValue?.id;
  }

  deleteAccount(account: Account) {
    if (!confirm(`Delete account for ${account.firstName} ${account.lastName}?`)) return;
    this.accountService.delete(account.id).subscribe({
      next: () => this.accounts = this.accounts.filter(a => a.id !== account.id),
      error: err => this.error = err
    });
  }
}
