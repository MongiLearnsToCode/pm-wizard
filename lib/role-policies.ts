import { UserRole } from '@/lib/database.types';

export const RLS_POLICIES = {
  // Check if user can access project
  canAccessProject: (userId: string, projectId: string) => `
    EXISTS (
      SELECT 1 FROM user_project_roles
      WHERE user_id = '${userId}' AND project_id = '${projectId}'
    ) OR
    EXISTS (
      SELECT 1 FROM team_project_roles tpr
      JOIN team_members tm ON tm.team_id = tpr.team_id
      WHERE tm.user_id = '${userId}' AND tpr.project_id = '${projectId}'
    )
  `,

  // Check if user has specific role in project
  hasProjectRole: (userId: string, projectId: string, role: UserRole) => `
    check_user_project_role('${userId}', '${projectId}', '${role}')
  `,

  // Check if user is org admin
  isOrgAdmin: (userId: string, orgId: string) => `
    is_org_admin('${userId}', '${orgId}')
  `,
};

export function buildRLSQuery(
  table: string,
  userId: string,
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
) {
  // Helper to build RLS queries programmatically if needed
  const policies: Record<string, string> = {
    projects: RLS_POLICIES.canAccessProject(userId, 'project_id'),
    tasks: RLS_POLICIES.canAccessProject(userId, 'project_id'),
  };

  return policies[table] || 'true';
}
