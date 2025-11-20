import { useRoleStore } from '@/store/role-store';
import { useProjectStore } from '@/store/project-store';
import { UserRole } from '@/lib/database.types';

export function useDashboardContext() {
  const { currentRole, currentProjectId, setCurrentProject } = useRoleStore();
  const { currentProject, setCurrentProject: setProject } = useProjectStore();

  const switchProject = (projectId: string) => {
    setCurrentProject(projectId);
  };

  const getDashboardRoute = (role: UserRole | null) => {
    if (!role) return '/login';
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'member':
        return '/member/dashboard';
      case 'viewer':
        return '/viewer/dashboard';
      default:
        return '/login';
    }
  };

  return {
    currentRole,
    currentProject,
    currentProjectId,
    switchProject,
    getDashboardRoute,
  };
}
