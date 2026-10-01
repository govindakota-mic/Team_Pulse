import { Injectable, signal } from '@angular/core';

/** Tracks whether the mobile slide-in sidebar is open. Unused on desktop, where the sidebar is always visible. */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
