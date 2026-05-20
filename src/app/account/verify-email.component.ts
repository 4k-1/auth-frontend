import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  templateUrl: './verify-email.component.html', standalone: false})
  
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
