import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'member' | 'viewer';

interface ProjectWithRole {
  id: string;
  name: string;
  role: UserRole;
  updated_at: string;
}

interface ProjectContextStore {
  currentProjectId: string | null;
  currentProjectRole: UserRole | null;
  currentProjectName: string | null;
  availableProjects: ProjectWithRole[];
  
  setCurrentProject: (projectId: string, role: UserRole, name: string) => void;
  setAvailableProjects: (projects: ProjectWithRole[]) => void;
  clearContext: () => void;
}

export const useProjectContext = create<ProjectContextStore>()(
  persist(
    (set) => ({
      currentProjectId: null,
      currentProjectRole: null,
      currentProjectName: null,
      availableProjects: [],
      
      setCurrentProject: (projectId, role, name) => 
        set({ 
          currentProjectId: projectId, 
          currentProjectRole: role,
          currentProjectName: name 
        }),
      
      setAvailableProjects: (projects) => 
        set({ availableProjects: projects }),
      
      clearContext: () => 
        set({ 
          currentProjectId: null, 
          currentProjectRole: null,
          currentProjectName: null,
          availableProjects: [] 
        }),
    }),
    {
      name: 'project-context',
      partialize: (state) => ({
        currentProjectId: state.currentProjectId,
        currentProjectRole: state.currentProjectRole,
        currentProjectName: state.currentProjectName,
      }),
    }
  )
);
