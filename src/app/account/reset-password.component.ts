import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { first } from 'rxjs/operators';
import { MustMatch } from '../_helpers/must-match.validator';

export enum TokenStatus {
  Validating = 'Validating',
  Invalid = 'Invalid',
  Valid = 'Valid'
}

@Component({ 
  templateUrl: 'reset-password.component.html', 
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  
  tokenStatus: TokenStatus = TokenStatus.Validating; 
  TokenStatus = TokenStatus;

  form!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  token = '';

  constructor(
    private fb: FormBuilder, 
    private accountService: AccountService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
    console.log('Token from URL:', this.token);

    if (!this.token) {
      this.tokenStatus = TokenStatus.Invalid;
      this.error = 'No reset token provided';
      return;
    }

    // Call backend to validate token
    this.accountService.validateResetToken(this.token)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Token is valid');
          this.tokenStatus = TokenStatus.Valid;
          
          // Initialize form AFTER token is validated
          this.form = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
          }, { 
            validator: MustMatch('password', 'confirmPassword')
          });
        },
        error: (err) => {
          console.error('Token validation failed:', err);
          this.tokenStatus = TokenStatus.Invalid;
          this.error = err.error?.message || 'Invalid or expired reset token';
        }
      });
  }

  get f() { return this.form?.controls || {}; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    
    this.loading = true;
    this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
      .pipe(first())
      .subscribe({
        next: (res: any) => { 
          this.success = res.message || 'Password reset successful! Redirecting to login...';
          this.loading = false;
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/account/login'], { queryParams: { reset: true } });
          }, 3000);
        },
        error: (err) => { 
          this.error = err.error?.message || err.message || 'Password reset failed';
          this.loading = false;
        }
      });
  }
}