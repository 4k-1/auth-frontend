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
  success = '';  // ✅ ADD THIS
  returnUrl = '/';

  constructor(private fb: FormBuilder, private accountService: AccountService,
              private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Initialize form FIRST
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    // ✅ CHECK FOR SUCCESS MESSAGES FROM URL PARAMETERS
    if (this.route.snapshot.queryParams['registered']) {
      this.success = 'Registration successful! Please check your email for verification link.';
    }
    
    if (this.route.snapshot.queryParams['verified']) {
      this.success = 'Email verified successfully! You can now login.';
    }
    
    if (this.route.snapshot.queryParams['reset']) {
      this.success = 'Password reset successful! You can now login with your new password.';
    }
    
    // Check if already logged in
    if (this.accountService.accountValue) {
      this.router.navigate(['/']);
    }
    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';  // Clear any success message
    
    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          console.log('Login successful!');
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err) => { 
          console.error('Login error:', err);
          // Better error message
          if (err === 'Please verify your email first') {
            this.error = 'Please verify your email before logging in. Check your inbox for the verification link.';
          } else if (err === 'Invalid email or password') {
            this.error = 'Invalid email or password. Please try again.';
          } else {
            this.error = err || 'Login failed. Please try again.';
          }
          this.loading = false;
        }
      });
  }
}