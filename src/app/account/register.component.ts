import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  templateUrl: './register.component.html',
  styles: [`
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
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
      display: block;
      color: #333;
      font-size: 14px;
      margin-bottom: 8px;
      font-weight: 500;
    }
    input[type="text"], input[type="email"], input[type="password"] {
      width: 100%;
      padding: 10px 12px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #333;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus {
      border-color: #0066cc;
    }
    input.invalid {
      border-color: #d32f2f;
    }
    .checkbox-group {
      margin-bottom: 15px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #333;
      font-size: 14px;
      cursor: pointer;
    }
    .checkbox-label input {
      width: auto;
    }
    .terms-link {
      color: #0066cc;
      text-decoration: none;
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
      margin-bottom: 15px;
      font-size: 14px;
      line-height: 1.6;
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
      cursor: not-allowed;
    }
    .auth-footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 14px;
    }
    .auth-footer a {
      color: #0066cc;
      text-decoration: none;
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
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    if (this.accountService.accountValue) this.router.navigate(['/']);
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: mustMatch('password', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.register(this.form.value)
      .subscribe({
        next: (res: any) => {
          this.success = res.message || 'Registration successful! Please check your email to verify your account.';
          this.loading = false;
        },
        error: err => { this.error = err; this.loading = false; }
      });
  }
}

function mustMatch(controlName: string, matchingControlName: string) {
  return (group: AbstractControl) => {
    const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);
    if (!control || !matchingControl) return null;
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) return null;
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
    return null;
  };
}
