import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({ templateUrl: 'forgot-password.component.html', standalone: false })
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
