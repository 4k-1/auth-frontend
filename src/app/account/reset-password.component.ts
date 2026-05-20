import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';

import { MustMatch } from './helpers/must-match.validator';
import {first} from 'rxjs/operators'; 

enum TokenStatus {
  Validating,
  Valid,
  Invalid,
 
}

@Component({ templateUrl: 'reset-password.component.html', standalone: false })
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
    }, { validators: MustMatch('password', 'confirmPassword') });
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

export class MustMatch {
  static validate(c1: string, c2: string) {
    return (group: AbstractControl) => {
      const a = group.get(c1), b = group.get(c2);
      if (!a || !b) return null;
      if (b.errors && !b.errors['mustMatch']) return null;
      a.value !== b.value ? b.setErrors({ mustMatch: true }) : b.setErrors(null);
      return null;
    };
  }
}
