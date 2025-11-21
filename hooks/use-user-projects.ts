import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useProjectContext } from '@/store/project-context-store';

export function useUserProjects() {
  const { setAvailableProjects, setCurrentProject, currentProjectId } = useProjectContext();
  const supabase = createClient();

  useEffect(() => {
    loadUserProjects();
  }, []);

  async function loadUserProjects() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch all projects where user has a role
    const { data: projectRoles } = await supabase
      .from('user_project_roles')
      .select('project_id, role, projects(id, name, updated_at)')
      .eq('user_id', user.id);

    if (!projectRoles || projectRoles.length === 0) return;

    const projects = projectRoles
      .map((pr: any) => ({
        id: pr.projects.id,
        name: pr.projects.name,
        role: pr.role,
        updated_at: pr.projects.updated_at,
      }))
      .sort((a: any, b: any) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

    setAvailableProjects(projects);

    // Set current project if not already set
    if (!currentProjectId && projects.length > 0) {
      const defaultProject = projects[0];
      setCurrentProject(defaultProject.id, defaultProject.role, defaultProject.name);
    }
  }

  return { loadUserProjects };
}
