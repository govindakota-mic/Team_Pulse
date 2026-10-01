import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { LayoutService } from '../services/layout/layout.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen bg-[#F5F6FA] overflow-hidden">
      <app-sidebar></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <header class="md:hidden flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-100 shrink-0">
          <button
            type="button"
            (click)="layout.toggleSidebar()"
            aria-label="Open menu"
            class="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span class="text-sm font-semibold text-gray-900">Team Pulse</span>
        </header>

        <main class="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8"><router-outlet></router-outlet></main>
      </div>
    </div>`,
})
export class MainLayoutComponent {
  layout = inject(LayoutService);
}
