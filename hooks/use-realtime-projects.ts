import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useProjectStore } from '@/store/project-store';

export function useRealtimeProjects() {
  const { setProjects, addProject, updateProject, removeProject } =
    useProjectStore();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          addProject(payload.new as any);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          updateProject(payload.new.id, payload.new as any);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          removeProject(payload.old.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, addProject, updateProject, removeProject]);
}
