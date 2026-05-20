import { Component, ChangeDetectorRef, OnInit , OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first , finalize} from 'rxjs/operators';

import { AlertService } from '../../_services/alert.service'; 
import { AccountService } from '../../_services/account.service'; 

@Component({
    selector: 'app-account-add-edit',
    templateUrl: './account-add-edit.component.html'
})
export class AccountAddEditComponent implements OnInit {
    title: string = '';
    form!: FormGroup;
    id?: number; // Changed from string to number
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        // Convert string param to number with +
        const idParam = this.route.snapshot.params['id'];
        this.id = idParam ? +idParam : undefined; // The '+' converts string to number
        
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
            this.accountService.getById(this.id) // Now this.id is number
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

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        
        const accountData = this.form.value;
        
        // remove confirmPassword from data
        delete accountData.confirmPassword;
        
        // if password is empty, remove it from the data
        if (!accountData.password) {
            delete accountData.password;
        }

        const action = this.id 
            ? this.accountService.update(this.id, accountData) // Now this.id is number
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