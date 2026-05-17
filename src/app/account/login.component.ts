import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  templateUrl: './login.component.html',
  styles: [authStyles()]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '/';

  constructor(private fb: FormBuilder, private accountService: AccountService,
              private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.accountService.accountValue) {
      this.router.navigate(['/']);
    }
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => this.router.navigateByUrl(this.returnUrl),
        error: err => { this.error = err; this.loading = false; }
      });
  }
}

function authStyles() {
  return `
    .auth-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .auth-box {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 30px 0;
      text-align: left;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      color: #333;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
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
      transition: border-color 0.2s;
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

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      font-size: 14px;
    }

    .register-link {
      color: #0066cc;
      text-decoration: none;
    }

    .register-link:hover {
      color: #0052a3;
    }

    .forgot-link {
      color: #0066cc;
      text-decoration: none;
    }

    .forgot-link:hover {
      color: #0052a3;
    }

    .auth-footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #666;
      max-width: 400px;
    }

    .auth-footer p {
      margin: 8px 0;
      line-height: 1.6;
    }

    .author {
      font-weight: 600;
      color: #333;
    }

    .success {
      color: #2e7d32;
      background: #e8f5e9;
      border: 1px solid #c8e6c9;
      border-radius: 4px;
      padding: 10px 12px;
      margin: 15px 0;
      font-size: 14px;
    }
  `;
}
