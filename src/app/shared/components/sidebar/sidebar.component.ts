import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CakeIcon,
  LayoutDashboard,
  LucideAngularModule,
  LucideIconData,
  Settings,
  Users,
} from 'lucide-angular';

interface NavItem {
  label: string;
  icon: LucideIconData;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly settingsIcon = Settings;
  readonly dashBoardIcon = LayoutDashboard;
  readonly teamIcon = Users;
  readonly celebrationIcon = CakeIcon;
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: this.dashBoardIcon, active: true },
    { label: 'Team Members', icon: this.teamIcon },
    { label: 'Celebrations', icon: this.celebrationIcon },
    { label: 'Settings', icon: this.settingsIcon },
  ];
}
