import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { UserService, AlertService } from './_services';

@Component({
  selector: 'app-profile-update',
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  submitting = false;
  deleting = false;
  userId?: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });

    // Load user data
    this.userService.getProfile()
      .pipe(first())
      .subscribe(user => {
        this.form.patchValue(user);
        this.userId = user.id;
      });
  }

  // Custom validator to check if passwords match
  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mustMatch']) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
      return null;
    };
  }

  // Convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    const updateData = { ...this.form.value };
    
    // Remove password fields if they're empty
    if (!updateData.password) {
      delete updateData.password;
      delete updateData.confirmPassword;
    }

    this.userService.updateProfile(this.userId!, updateData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Profile updated successfully', { autoClose: true });
          this.router.navigate(['../details'], { relativeTo: this.route });
        },
        error: (error) => {
          this.alertService.error(error);
          this.submitting = false;
        }
      });
  }

  onDelete() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.deleting = true;
      this.userService.deleteUser(this.userId!)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Account deleted successfully');
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.alertService.error(error);
            this.deleting = false;
          }
        });
    }
  }
}