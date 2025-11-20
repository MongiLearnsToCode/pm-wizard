'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  BarChart3,
  Wand2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardSwitcher } from '@/components/role/dashboard-switcher';
import { UserProfile } from '@/components/navigation/user-profile';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/teams', label: 'Teams', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/wizard', label: 'New Project', icon: Wand2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/40 p-6 flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold">PM Wizard</h1>
        <DashboardSwitcher />
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t">
        <UserProfile />
      </div>
    </aside>
  );
}
