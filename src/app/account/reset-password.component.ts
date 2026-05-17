import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  templateUrl: './reset-password.component.html',
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
      margin-bottom: 15px;
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
    .success a {
      color: #2e7d32;
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
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  token = '';

  constructor(private fb: FormBuilder, private accountService: AccountService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: mustMatch('password', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
      .subscribe({
        next: (res: any) => { this.success = res.message; this.loading = false; },
        error: err => { this.error = err; this.loading = false; }
      });
  }
}

function mustMatch(c1: string, c2: string) {
  return (group: AbstractControl) => {
    const a = group.get(c1), b = group.get(c2);
    if (!a || !b) return null;
    if (b.errors && !b.errors['mustMatch']) return null;
    a.value !== b.value ? b.setErrors({ mustMatch: true }) : b.setErrors(null);
    return null;
  };
}
