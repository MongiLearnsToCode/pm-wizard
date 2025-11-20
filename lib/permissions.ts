import { UserRole } from '@/lib/database.types';

export const PERMISSIONS = {
  // Project permissions
  CREATE_PROJECT: 'create_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  VIEW_PROJECT: 'view_project',

  // Task permissions
  CREATE_TASK: 'create_task',
  EDIT_ANY_TASK: 'edit_any_task',
  EDIT_OWN_TASK: 'edit_own_task',
  DELETE_TASK: 'delete_task',
  VIEW_TASK: 'view_task',
  ASSIGN_TASK: 'assign_task',

  // Team permissions
  MANAGE_TEAMS: 'manage_teams',
  VIEW_TEAMS: 'view_teams',

  // Role permissions
  ASSIGN_ROLES: 'assign_roles',

  // Comment permissions
  CREATE_COMMENT: 'create_comment',
  EDIT_OWN_COMMENT: 'edit_own_comment',
  DELETE_ANY_COMMENT: 'delete_any_comment',

  // File permissions
  UPLOAD_FILE: 'upload_file',
  DELETE_FILE: 'delete_file',

  // Analytics permissions
  VIEW_FULL_ANALYTICS: 'view_full_analytics',
  VIEW_LIMITED_ANALYTICS: 'view_limited_analytics',

  // Organization permissions
  MANAGE_ORG_SETTINGS: 'manage_org_settings',
  VIEW_ORG_SETTINGS: 'view_org_settings',

  // Export permissions
  EXPORT_DATA: 'export_data',
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.EDIT_ANY_TASK,
    PERMISSIONS.EDIT_OWN_TASK,
    PERMISSIONS.DELETE_TASK,
    PERMISSIONS.VIEW_TASK,
    PERMISSIONS.ASSIGN_TASK,
    PERMISSIONS.MANAGE_TEAMS,
    PERMISSIONS.VIEW_TEAMS,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.CREATE_COMMENT,
    PERMISSIONS.EDIT_OWN_COMMENT,
    PERMISSIONS.DELETE_ANY_COMMENT,
    PERMISSIONS.UPLOAD_FILE,
    PERMISSIONS.DELETE_FILE,
    PERMISSIONS.VIEW_FULL_ANALYTICS,
    PERMISSIONS.MANAGE_ORG_SETTINGS,
    PERMISSIONS.VIEW_ORG_SETTINGS,
    PERMISSIONS.EXPORT_DATA,
  ],
  member: [
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.EDIT_OWN_TASK,
    PERMISSIONS.VIEW_TASK,
    PERMISSIONS.VIEW_TEAMS,
    PERMISSIONS.CREATE_COMMENT,
    PERMISSIONS.EDIT_OWN_COMMENT,
    PERMISSIONS.UPLOAD_FILE,
    PERMISSIONS.VIEW_LIMITED_ANALYTICS,
  ],
  viewer: [
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_TASK,
    PERMISSIONS.VIEW_TEAMS,
    PERMISSIONS.VIEW_FULL_ANALYTICS,
    PERMISSIONS.VIEW_ORG_SETTINGS,
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
