import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';
import { first } from 'rxjs/operators';

// Custom validator for matching passwords
export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';  // ✅ ADDED success message

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: mustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';  // Clear any previous messages

    // Log form values for debugging (remove in production)
    console.log('Form submitted:', this.form.value);
    console.log('Form valid:', this.form.valid);

    if (this.form.invalid) {
      console.log('Form is invalid');
      // Log which fields are invalid
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
      return;
    }

    this.loading = true;
    
    // Prepare data for API (ensure all fields are correct)
    const registrationData = {
      title: this.f['title'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value,
      acceptTerms: this.f['acceptTerms'].value
    };

    this.accountService.register(registrationData)
      .pipe(first())
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.alertService.success('Registration successful, please check your email for verification link.', { keepAfterRouteChange: true });
          this.router.navigate(['/account/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          
          // Better error messages based on response
          if (error.error?.message) {
            this.error = error.error.message;
          } else if (error.message) {
            this.error = error.message;
          } else if (error.status === 0) {
            this.error = 'Cannot connect to server. Please check your internet connection.';
          } else if (error.status === 409) {
            this.error = 'Email already registered. Please use a different email or login.';
          } else if (error.status === 400) {
            this.error = 'Invalid registration data. Please check all fields.';
          } else {
            this.error = 'Registration failed. Please try again later.';
          }
          
          this.loading = false;
        }
      });
  }

  // Helper method to clear errors (useful for form reset)
  clearForm() {
    this.form.reset({
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    });
    this.submitted = false;
    this.error = '';
    this.success = '';
  }
}