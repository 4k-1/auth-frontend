import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  templateUrl: './forgot-password.component.html',
  styles: [`
    .auth-header {
      margin-bottom: 2rem;
      text-align: left;
    }
    .auth-header h2 {
      color: #333;
      font-size: 24px;
      margin: 0 0 0.5rem;
      font-weight: 600;
    }
    .auth-header p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      color: #333;
      font-size: 14px;
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 10px 12px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #333;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
    }
    input:focus {
      border-color: #0066cc;
    }
    input.invalid {
      border-color: #d32f2f;
    }
    .error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
    }
    .error.alert {
      background: #ffebee;
      border: 1px solid #ffcdd2;
      border-radius: 4px;
      padding: 10px 12px;
      margin: 15px 0;
    }
    .success {
      color: #2e7d32;
      background: #e8f5e9;
      border: 1px solid #c8e6c9;
      border-radius: 4px;
      padding: 12px;
      font-size: 14px;
    }
    .btn-primary {
      width: 100%;
      padding: 10px 16px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 10px;
    }
    .btn-primary:hover:not(:disabled) {
      background: #0052a3;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .auth-footer {
      text-align: center;
      margin-top: 20px;
    }
    .auth-footer a {
      color: #0066cc;
      text-decoration: none;
      font-size: 14px;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(0,102,204,0.3);
      border-top-color: #0066cc;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private accountService: AccountService) {}

  ngOnInit() {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this.accountService.forgotPassword(this.f['email'].value)
      .subscribe({
        next: (res: any) => { this.success = res.message; this.loading = false; },
        error: err => { this.error = err; this.loading = false; }
      });
  }
}
