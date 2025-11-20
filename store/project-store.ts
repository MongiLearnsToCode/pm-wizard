import { create } from 'zustand';
import { Database } from '@/lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  filters: {
    status?: string;
    search?: string;
  };
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setFilters: (filters: ProjectStore['filters']) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProject: null,
  filters: {},
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setFilters: (filters) => set({ filters }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
}));
