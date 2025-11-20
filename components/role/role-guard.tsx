import { ReactNode } from 'react';
import { UserRole } from '@/lib/database.types';
import { useRole } from '@/hooks/use-role';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  projectId?: string;
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  projectId,
  fallback = null,
}: RoleGuardProps) {
  const { role, loading } = useRole(projectId);

  if (loading) return null;
  if (!role || !allowedRoles.includes(role)) return <>{fallback}</>;

  return <>{children}</>;
}
