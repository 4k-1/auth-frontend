import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './_services/account.service';
import { Account } from './_models/account';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    .navbar {
      background: white;
      border-bottom: 1px solid #ddd;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand a {
      color: #333;
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-links a {
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #0066cc;
    }
    .btn-register {
      background: #0066cc;
      color: white !important;
      padding: 6px 16px;
      border-radius: 6px;
    }
    .btn-logout {
      background: none;
      border: 1px solid #ddd;
      color: #666;
      padding: 5px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .btn-logout:hover { border-color: #d32f2f; color: #d32f2f; }
    .user-badge {
      background: #f0f0f0;
      color: #0066cc;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #ddd;
    }
    .user-badge.admin { color: #f59e0b; border-color: #f59e0b44; background: #fffbf0; }
    .main-content { min-height: calc(100vh - 60px); background-color: #f5f5f5; }
  `]
})
export class AppComponent implements OnInit {
  account: Account | null = null;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    this.accountService.account$.subscribe(a => this.account = a);
  }

  get isAdmin() { return this.account?.role === 'Admin'; }

  logout() { this.accountService.logout(); }
}
