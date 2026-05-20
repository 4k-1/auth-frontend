import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './_services/account.service';
import { Account } from './_models/account';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
     standalone: false
})
export class AppComponent implements OnInit {
  account: Account | null = null;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    this.accountService.account$.subscribe(a => this.account = a);
  }

  get isAdmin() { return this.account?.role === 'Admin'; }

  logout() { this.accountService.logout(); }
}
