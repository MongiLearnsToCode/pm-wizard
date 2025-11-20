import { renderHook, act } from '@testing-library/react';
import { useRoleStore } from '@/store/role-store';

describe('Role Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useRoleStore());
    act(() => {
      result.current.setRole(null);
      result.current.setAvailableRoles([]);
      result.current.setCurrentProject(null);
    });
  });

  it('sets current role', () => {
    const { result } = renderHook(() => useRoleStore());

    act(() => {
      result.current.setRole('admin');
    });

    expect(result.current.currentRole).toBe('admin');
  });

  it('sets available roles', () => {
    const { result } = renderHook(() => useRoleStore());

    act(() => {
      result.current.setAvailableRoles(['admin', 'member']);
    });

    expect(result.current.availableRoles).toEqual(['admin', 'member']);
  });

  it('switches role', () => {
    const { result } = renderHook(() => useRoleStore());

    act(() => {
      result.current.setRole('admin');
      result.current.switchRole('member');
    });

    expect(result.current.currentRole).toBe('member');
  });

  it('sets current project', () => {
    const { result } = renderHook(() => useRoleStore());
    const projectId = 'test-project-id';

    act(() => {
      result.current.setCurrentProject(projectId);
    });

    expect(result.current.currentProjectId).toBe(projectId);
  });
});
