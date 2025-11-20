import { hasPermission, PERMISSIONS, ROLE_PERMISSIONS } from '@/lib/permissions';

describe('Role Permissions', () => {
  it('admin has all permissions', () => {
    expect(hasPermission('admin', PERMISSIONS.CREATE_PROJECT)).toBe(true);
    expect(hasPermission('admin', PERMISSIONS.DELETE_PROJECT)).toBe(true);
    expect(hasPermission('admin', PERMISSIONS.ASSIGN_ROLES)).toBe(true);
  });

  it('member has limited permissions', () => {
    expect(hasPermission('member', PERMISSIONS.EDIT_OWN_TASK)).toBe(true);
    expect(hasPermission('member', PERMISSIONS.CREATE_COMMENT)).toBe(true);
    expect(hasPermission('member', PERMISSIONS.CREATE_PROJECT)).toBe(false);
    expect(hasPermission('member', PERMISSIONS.ASSIGN_ROLES)).toBe(false);
  });

  it('viewer has read-only permissions', () => {
    expect(hasPermission('viewer', PERMISSIONS.VIEW_PROJECT)).toBe(true);
    expect(hasPermission('viewer', PERMISSIONS.VIEW_TASK)).toBe(true);
    expect(hasPermission('viewer', PERMISSIONS.CREATE_COMMENT)).toBe(false);
    expect(hasPermission('viewer', PERMISSIONS.EDIT_OWN_TASK)).toBe(false);
  });

  it('role permissions are properly defined', () => {
    expect(ROLE_PERMISSIONS.admin.length).toBeGreaterThan(
      ROLE_PERMISSIONS.member.length
    );
    expect(ROLE_PERMISSIONS.member.length).toBeGreaterThan(
      ROLE_PERMISSIONS.viewer.length
    );
  });
});
