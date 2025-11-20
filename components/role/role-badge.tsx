import { UserRole } from '@/lib/database.types';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleConfig: Record<
  UserRole,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  admin: { label: 'Admin', variant: 'default' },
  member: { label: 'Member', variant: 'secondary' },
  viewer: { label: 'Viewer', variant: 'outline' },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
