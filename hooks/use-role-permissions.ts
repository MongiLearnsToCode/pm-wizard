import { useRole } from './use-role';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';

export function useRolePermissions(projectId?: string) {
  const { role, loading } = useRole(projectId);

  const canEditTask = (isOwnTask: boolean = false) => {
    if (!role) return false;
    if (isOwnTask) return hasPermission(role, PERMISSIONS.EDIT_OWN_TASK);
    return hasPermission(role, PERMISSIONS.EDIT_ANY_TASK);
  };

  const canCreateProject = () =>
    role ? hasPermission(role, PERMISSIONS.CREATE_PROJECT) : false;

  const canEditProject = () =>
    role ? hasPermission(role, PERMISSIONS.EDIT_PROJECT) : false;

  const canDeleteProject = () =>
    role ? hasPermission(role, PERMISSIONS.DELETE_PROJECT) : false;

  const canCreateTask = () =>
    role ? hasPermission(role, PERMISSIONS.CREATE_TASK) : false;

  const canDeleteTask = () =>
    role ? hasPermission(role, PERMISSIONS.DELETE_TASK) : false;

  const canAssignTask = () =>
    role ? hasPermission(role, PERMISSIONS.ASSIGN_TASK) : false;

  const canManageTeams = () =>
    role ? hasPermission(role, PERMISSIONS.MANAGE_TEAMS) : false;

  const canAssignRoles = () =>
    role ? hasPermission(role, PERMISSIONS.ASSIGN_ROLES) : false;

  const canCreateComment = () =>
    role ? hasPermission(role, PERMISSIONS.CREATE_COMMENT) : false;

  const canUploadFile = () =>
    role ? hasPermission(role, PERMISSIONS.UPLOAD_FILE) : false;

  const canViewAnalytics = () =>
    role
      ? hasPermission(role, PERMISSIONS.VIEW_FULL_ANALYTICS) ||
        hasPermission(role, PERMISSIONS.VIEW_LIMITED_ANALYTICS)
      : false;

  const canExportData = () =>
    role ? hasPermission(role, PERMISSIONS.EXPORT_DATA) : false;

  const canManageOrgSettings = () =>
    role ? hasPermission(role, PERMISSIONS.MANAGE_ORG_SETTINGS) : false;

  return {
    role,
    loading,
    canEditTask,
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canCreateTask,
    canDeleteTask,
    canAssignTask,
    canManageTeams,
    canAssignRoles,
    canCreateComment,
    canUploadFile,
    canViewAnalytics,
    canExportData,
    canManageOrgSettings,
  };
}
