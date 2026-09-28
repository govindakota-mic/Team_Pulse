import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen bg-[#F5F6FA]">
      <app-sidebar></app-sidebar>
      <main class="flex-1 overflow-y-auto p-8"><router-outlet></router-outlet></main>
    </div>`,
})
export class MainLayoutComponent {}
