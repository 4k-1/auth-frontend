import { Component } from '@angular/core';

@Component({
  templateUrl: './layout.component.html',
  styles: [`
    .auth-wrapper {
      min-height: calc(100vh - 60px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      padding: 2rem;
    }
    .auth-card {
      background: transparent;
      width: 100%;
      max-width: 440px;
    }
  `]
})
export class AccountLayoutComponent { }
