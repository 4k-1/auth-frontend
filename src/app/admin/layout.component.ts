// admin/layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ADD THIS

@Component({
  selector: 'app-admin-layout',
  templateUrl: './layout.component.html',
  standalone: true, // Change to true if standalone
  imports: [RouterModule] // ADD THIS
})
export class LayoutComponent {}