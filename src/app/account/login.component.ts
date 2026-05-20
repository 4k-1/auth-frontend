import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  templateUrl: './login.component.html'
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

