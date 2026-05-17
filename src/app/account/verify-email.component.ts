import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  templateUrl: './verify-email.component.html',
  styles: [`
    .auth-header h2 {
      color: #333;
      font-size: 24px;
      margin: 0 0 1.5rem;
      font-weight: 600;
    }
    .status-box {
      text-align: center;
      padding: 30px;
      border-radius: 8px;
      border: 1px solid #ddd;
      background: #f9f9f9;
    }
    .status-box.loading {
      border-color: #0066cc;
      background: #f0f8ff;
    }
    .status-box.success {
      border-color: #4caf50;
      background: #e8f5e9;
    }
    .status-box.error {
      border-color: #d32f2f;
      background: #ffebee;
    }
    .status-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }
    p {
      color: #333;
      font-size: 14px;
      margin: 0 0 20px;
    }
    .btn-primary {
      display: inline-block;
      padding: 10px 24px;
      background: #0066cc;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
    }
    .btn-primary:hover {
      background: #0052a3;
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  status = 'verifying';
  message = 'Verifying your email address...';

  constructor(private route: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.status = 'error';
      this.message = 'No verification token found.';
      return;
    }

    this.accountService.verifyEmail(token).subscribe({
      next: (res: any) => {
        this.status = 'success';
        this.message = res.message || 'Email verified! You can now log in.';
      },
      error: err => {
        this.status = 'error';
        this.message = err || 'Verification failed. The link may be expired or invalid.';
      }
    });
  }
}
