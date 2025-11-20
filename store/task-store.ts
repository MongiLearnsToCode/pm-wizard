import { create } from 'zustand';
import { Database } from '@/lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskStore {
  tasks: Task[];
  currentTask: Task | null;
  filters: {
    status?: string;
    priority?: string;
    assignedTo?: string;
  };
  setTasks: (tasks: Task[]) => void;
  setCurrentTask: (task: Task | null) => void;
  setFilters: (filters: TaskStore['filters']) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  currentTask: null,
  filters: {},
  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (task) => set({ currentTask: task }),
  setFilters: (filters) => set({ filters }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));
