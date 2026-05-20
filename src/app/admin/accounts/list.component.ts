import { Component, ChangeDetectorRef, OnInit , OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first , finalize} from 'rxjs/operators';

import { AlertService } from '../../_services/alert.service'; 
import { AccountService } from '../../_services/account.service'; 

@Component({
    selector: 'app-account-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    title: string = '';
    form!: FormGroup;
    id?: number;
    loading = false;
    submitting = false;
    submitted = false;
    
    // ADD THESE TWO PROPERTIES
    accounts: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        // LOAD ACCOUNTS LIST - ADD THIS
        this.loadAccounts();
        
        const idParam = this.route.snapshot.params['id'];
        this.id = idParam ? +idParam : undefined;
        
        this.title = this.id ? 'Edit Account' : 'Add Account';

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: ['']
        }, {
            validator: this.mustMatch('password', 'confirmPassword')
        });

        this.loading = true;
        if (this.id) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe({
                    next: (account) => {
                        this.form.patchValue(account);
                        this.loading = false;
                    },
                    error: (error) => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        } else {
            this.loading = false;
        }
    }

    // ADD THIS METHOD TO LOAD ACCOUNTS
    loadAccounts() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe({
                next: (accounts) => {
                    this.accounts = accounts;
                },
                error: (error) => {
                    this.alertService.error(error);
                }
            });
    }

    // ADD THIS DELETE METHOD
    deleteAccount(id: number) {
        if (confirm('Are you sure you want to delete this account?')) {
            this.accountService.delete(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.accounts = this.accounts.filter(x => x.id !== id);
                        this.alertService.success('Account deleted successfully');
                    },
                    error: (error) => {
                        this.alertService.error(error);
                    }
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    // custom validator to check that two fields match
    mustMatch(controlName: string, matchingControlName: string) {
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

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        
        const accountData = this.form.value;
        
        delete accountData.confirmPassword;
        
        if (!accountData.password) {
            delete accountData.password;
        }

        const action = this.id 
            ? this.accountService.update(this.id, accountData)
            : this.accountService.create(accountData);

        action.pipe(first(), finalize(() => {
            this.submitting = false;
        }))
            .subscribe({
                next: () => {
                    this.alertService.success(`${this.title} successful`, { keepAfterRouteChange: true });
                    this.router.navigate(['/admin/accounts']);
                },
                error: (error) => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}