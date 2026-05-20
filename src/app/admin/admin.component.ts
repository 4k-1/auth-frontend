import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/account';

@Component({ templateUrl: 'admin.component.html', standalone: false })  
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
