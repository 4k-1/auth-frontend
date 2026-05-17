import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/account';

@Component({
  templateUrl: './home.component.html',
  styles: [`
    .home-container { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem; }
    .hero { text-align: center; padding: 3rem 0 4rem; }
    .hero-badge { display: inline-block; background: #e3f2fd; border: 1px solid #90caf9;
                  color: #0066cc; padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; }
    h1 { color: #333; font-size: 3rem; font-weight: 800; margin: 0 0 1rem; line-height: 1.2; letter-spacing: -1px; }
    .gradient-text { background: linear-gradient(135deg, #0066cc, #0052a3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-desc { color: #666; font-size: 1.1rem; max-width: 500px; margin: 0 auto 2.5rem; line-height: 1.6; }
    .cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .btn-primary { padding: 12px 28px; background: #0066cc; color: white; text-decoration: none;
                   border-radius: 8px; font-weight: 600; font-size: 0.95rem; transition: background 0.2s; }
    .btn-primary:hover { background: #0052a3; }
    .btn-secondary { padding: 12px 28px; background: transparent; color: #666; text-decoration: none;
                     border-radius: 8px; border: 1px solid #ddd; font-weight: 600; font-size: 0.95rem; transition: all 0.2s; }
    .btn-secondary:hover { border-color: #0066cc; color: #0066cc; }
    .welcome-card { display: inline-flex; align-items: center; gap: 1rem; background: white;
                    border: 1px solid #ddd; border-radius: 12px; padding: 1rem 1.5rem; }
    .welcome-icon { font-size: 1.8rem; }
    .welcome-info { display: flex; flex-direction: column; align-items: flex-start; gap: 0.3rem; }
    .welcome-info strong { color: #333; font-size: 1rem; }
    .role-badge { background: #f0f0f0; color: #0066cc; padding: 2px 10px; border-radius: 12px;
                  font-size: 0.7rem; font-weight: 700; border: 1px solid #ddd; }
    .role-badge.admin { color: #f59e0b; border-color: #f59e0b44; background: #fffbf0; }
    .welcome-links { display: flex; gap: 1rem; margin-left: 1rem; }
    .welcome-links a { color: #0066cc; text-decoration: none; font-size: 0.875rem; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
    .feature-card { background: white; border: 1px solid #ddd; border-radius: 12px; padding: 1.5rem;
                    transition: border-color 0.2s, transform 0.2s; }
    .feature-card:hover { border-color: #0066cc; transform: translateY(-2px); }
    .feature-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .feature-card h3 { color: #333; font-size: 1rem; margin: 0 0 0.5rem; font-weight: 600; }
    .feature-card p { color: #666; font-size: 0.875rem; margin: 0; line-height: 1.6; }
  `]
})
export class HomeComponent implements OnInit {
  account: Account | null = null;
  constructor(private accountService: AccountService) {}
  ngOnInit() { this.accountService.account$.subscribe(a => this.account = a); }
}
