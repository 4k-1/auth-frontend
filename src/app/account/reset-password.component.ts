import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { first } from 'rxjs/operators';
import { MustMatch } from '../_helpers/must-match.validator';
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
    }, { 
      validator: MustMatch('password', 'confirmPassword') // Changed from 'validators' to 'validator'
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
      .subscribe({
        next: (res: any) => { 
          this.success = res.message; 
          this.loading = false; 
        },
        error: err => { 
          this.error = err; 
          this.loading = false; 
        }
      });
  }
}

// REMOVE this entire class at the bottom:
// export class MustMatch {
//   static validate(c1: string, c2: string) {
//     ...
//   }
// }