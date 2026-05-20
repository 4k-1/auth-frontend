import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/account';

@Component({
  templateUrl: './home.component.html',
  standalone: false 
})
export class HomeComponent implements OnInit {
  account: Account | null = null;
  constructor(private accountService: AccountService) {}
  ngOnInit() { this.accountService.account$.subscribe(a => this.account = a); }
}
