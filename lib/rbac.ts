import { UserRole } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';

export async function getUserRole(
  userId: string,
  projectId: string
): Promise<UserRole | null> {
  const supabase = await createClient();

  const { data, error } = await (supabase as any).rpc('get_user_project_role', {
    p_user_id: userId,
    p_project_id: projectId,
  });

  if (error) return null;
  return data as UserRole | null;
}

export async function checkPermission(
  userId: string,
  projectId: string,
  requiredRole: UserRole
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await (supabase as any).rpc('check_user_project_role', {
    p_user_id: userId,
    p_project_id: projectId,
    p_required_role: requiredRole,
  });

  if (error) return false;
  return data as boolean;
}

export async function hasRole(
  userId: string,
  projectId: string,
  role: UserRole
): Promise<boolean> {
  const userRole = await getUserRole(userId, projectId);
  if (!userRole) return false;

  const roleHierarchy: Record<UserRole, number> = {
    admin: 3,
    member: 2,
    viewer: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[role];
}

export async function isOrgAdmin(
  userId: string,
  orgId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await (supabase as any).rpc('is_org_admin', {
    p_user_id: userId,
    p_org_id: orgId,
  });

  if (error) return false;
  return data as boolean;
}

export async function getUserProjects(userId: string) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any).rpc('get_user_projects', {
    p_user_id: userId,
  });

  if (error) return [];
  return data;
}
