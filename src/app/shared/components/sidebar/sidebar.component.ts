import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  CakeIcon,
  CalendarDays,
  LayoutDashboard,
  LucideAngularModule,
  LucideIconData,
  Users,
} from 'lucide-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { DataService } from '../../../services/data/data.service';
import { LayoutService } from '../../../services/layout/layout.service';

interface NavItem {
  label: string;
  icon: LucideIconData;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  layout = inject(LayoutService);
  pendingCount = inject(DataService).pending;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, link: '/dashboard' },
    { label: 'Team Members', icon: Users, link: '/team' },
    { label: 'Celebrations', icon: CakeIcon, link: '/celebrations' },
    { label: 'Holidays', icon: CalendarDays, link: '/holidays' },
  ];

  logout() {
    this.layout.closeSidebar();
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/login'));
  }
}
