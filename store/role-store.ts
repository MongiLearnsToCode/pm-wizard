import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { UserRole } from '@/lib/database.types';

interface RoleStore {
  currentRole: UserRole | null;
  availableRoles: UserRole[];
  currentProjectId: string | null;
  setRole: (role: UserRole) => void;
  setAvailableRoles: (roles: UserRole[]) => void;
  setCurrentProject: (projectId: string | null) => void;
  switchRole: (role: UserRole) => void;
}

export const useRoleStore = create<RoleStore>()(
  devtools(
    persist(
      (set) => ({
        currentRole: null,
        availableRoles: [],
        currentProjectId: null,
        setRole: (role) => set({ currentRole: role }),
        setAvailableRoles: (roles) => set({ availableRoles: roles }),
        setCurrentProject: (projectId) => set({ currentProjectId: projectId }),
        switchRole: (role) => set({ currentRole: role }),
      }),
      {
        name: 'role-storage',
      }
    ),
    { name: 'RoleStore' }
  )
);
