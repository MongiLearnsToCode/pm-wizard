'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/posthog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MemberProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    trackEvent('projects_viewed', { role: 'member' });
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_project_roles')
      .select('project_id, projects(*)')
      .eq('user_id', user.id);

    setProjects(data?.map((d: any) => d.projects).filter(Boolean) || []);
  }

  const toSlug = (name: string, id: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${slug}-${id}`;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Projects</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/member/projects/${toSlug(project.name, project.id)}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description || 'No description'}
              </p>
              {project.deadline && (
                <p className="text-xs text-muted-foreground mt-2">
                  Due: {new Date(project.deadline).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You haven't been assigned to any projects yet.</p>
        </div>
      )}
    </div>
  );
}
