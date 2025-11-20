'use client';

import { useRouter } from 'next/navigation';
import { useRoleStore } from '@/store/role-store';
import { useDashboardContext } from '@/hooks/use-dashboard-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { RoleBadge } from './role-badge';

export function DashboardSwitcher() {
  const { currentRole, availableRoles, switchRole } = useRoleStore();
  const { getDashboardRoute } = useDashboardContext();
  const router = useRouter();

  if (!currentRole || availableRoles.length <= 1) return null;

  const handleSwitch = (role: typeof currentRole) => {
    if (!role) return;
    switchRole(role);
    router.push(getDashboardRoute(role));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <RoleBadge role={currentRole} />
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableRoles.map((role) => (
          <DropdownMenuItem key={role} onClick={() => handleSwitch(role)}>
            <RoleBadge role={role} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
