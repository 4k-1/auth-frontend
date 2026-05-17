import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/account';

@Component({
  templateUrl: './profile.component.html',
  styles: [`
    .profile-container { max-width: 700px; margin: 0 auto; padding: 2.5rem 2rem; }
    .profile-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
    .avatar { width: 72px; height: 72px; background: linear-gradient(135deg, #0066cc, #0052a3);
               border-radius: 50%; display: flex; align-items: center; justify-content: center;
               color: white; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
    .profile-info h1 { color: #333; font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; }
    .profile-info p { color: #666; font-size: 0.875rem; margin: 0 0 0.5rem; }
    .role-badge { background: #f0f0f0; color: #0066cc; padding: 3px 10px; border-radius: 12px;
                  font-size: 0.75rem; font-weight: 600; border: 1px solid #ddd; }
    .role-badge.admin { color: #f59e0b; border-color: #f59e0b44; background: #fffbf0; }
    .profile-card { background: white; border: 1px solid #ddd; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; }
    h2 { color: #333; font-size: 1.1rem; margin: 0 0 1.5rem; font-weight: 600; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.2rem; }
    label { color: #333; font-size: 0.85rem; display: block; margin-bottom: 0.4rem; font-weight: 500; }
    input { width: 100%; padding: 10px 12px; background: #fff; border: 1px solid #ddd;
            border-radius: 4px; color: #333; font-size: 0.95rem; box-sizing: border-box; outline: none; }
    input:focus { border-color: #0066cc; }
    .divider { display: flex; align-items: center; margin: 1.2rem 0; }
    .divider span { color: #999; font-size: 0.8rem; padding: 0 0.75rem; border: 1px solid #ddd; border-radius: 20px; }
    .error { color: #d32f2f; font-size: 0.8rem; margin-top: 0.3rem; }
    .error.alert { background: #ffebee; border: 1px solid #ffcdd2; border-radius: 4px; padding: 10px 12px; margin-bottom: 1rem; }
    .success { color: #2e7d32; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 4px; padding: 12px 12px; margin-bottom: 1rem; font-size: 0.875rem; }
    .btn-primary { padding: 10px 24px; background: #0066cc; color: white; border: none;
                   border-radius: 4px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-primary:hover:not(:disabled) { background: #0052a3; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .token-info { background: #f9f9f9; border: 1px solid #ddd; border-radius: 12px; padding: 1.5rem; }
    h3 { color: #333; font-size: 0.95rem; margin: 0 0 1rem; }
    .token-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
    .token-row:last-of-type { border-bottom: none; }
    .token-label { color: #666; font-size: 0.8rem; }
    .token-value { color: #333; font-size: 0.8rem; font-family: monospace; }
    .token-note { color: #999; font-size: 0.75rem; margin-top: 0.75rem; }
  `]
})
export class ProfileComponent implements OnInit {
  account: Account | null = null;
  form!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  jwtInfo: any = null;

  constructor(private fb: FormBuilder, private accountService: AccountService) {}

  get initials() {
    if (!this.account) return '?';
    return `${this.account.firstName[0]}${this.account.lastName[0]}`.toUpperCase();
  }

  ngOnInit() {
    this.account = this.accountService.accountValue;
    this.form = this.fb.group({
      firstName: [this.account?.firstName, Validators.required],
      lastName: [this.account?.lastName, Validators.required],
      email: [this.account?.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: mustMatch('password', 'confirmPassword') });

    // Decode JWT for display
    try {
      const token = this.account?.jwtToken;
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.jwtInfo = { ...payload, exp: new Date(payload.exp * 1000) };
      }
    } catch (e) {}
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';
    if (this.form.invalid) return;

    this.loading = true;
    const id = this.account!.id;
    const params: any = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
    };
    if (this.f['password'].value) params.password = this.f['password'].value;

    this.accountService.update(id, params).subscribe({
      next: () => {
        this.success = 'Profile updated successfully!';
        this.account = this.accountService.accountValue;
        this.loading = false;
      },
      error: err => { this.error = err; this.loading = false; }
    });
  }
}

function mustMatch(c1: string, c2: string) {
  return (g: AbstractControl) => {
    const a = g.get(c1), b = g.get(c2);
    if (!a || !b || !a.value) return null;
    if (b.errors && !b.errors['mustMatch']) return null;
    a.value !== b.value ? b.setErrors({ mustMatch: true }) : b.setErrors(null);
    return null;
  };
}
