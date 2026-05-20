import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

// ADD THIS ENUM HERE - before @Component
export enum EmailStatus {
  Verifying = 'Verifying',
  Failed = 'Failed',
  Success = 'Success'
}

@Component({
  templateUrl: './verify-email.component.html', 
  standalone: false
})
export class VerifyEmailComponent implements OnInit {
  
  // ADD THESE TWO LINES
  emailStatus: EmailStatus = EmailStatus.Verifying;
  EmailStatus = EmailStatus;

  status = 'verifying';
  message = 'Verifying your email address...';

  constructor(private route: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.emailStatus = EmailStatus.Failed; // ADD THIS
      this.status = 'error';
      this.message = 'No verification token found.';
      return;
    }

    this.accountService.verifyEmail(token).subscribe({
      next: (res: any) => {
        this.emailStatus = EmailStatus.Success; // ADD THIS
        this.status = 'success';
        this.message = res.message || 'Email verified! You can now log in.';
      },
      error: err => {
        this.emailStatus = EmailStatus.Failed; // ADD THIS
        this.status = 'error';
        this.message = err || 'Verification failed. The link may be expired or invalid.';
      }
    });
  }
}