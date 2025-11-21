'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskItemViewer } from '@/components/tasks/task-item-viewer';

export default function ViewerProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const supabase = createClient();

  // Extract UUID from slug (format: project-name-uuid)
  const getIdFromSlug = (slug: string) => {
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const match = slug.match(uuidRegex);
    return match ? match[0] : slug;
  };

  const projectId = getIdFromSlug(params.id as string);

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [projectId]);

  async function loadProject() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    setProject(data);
  }

  async function loadTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    setTasks(data || []);
  }

  if (!project) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <Badge>{project.status}</Badge>
          <Badge variant="outline" className="text-yellow-600">Read Only</Badge>
        </div>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <TaskItemViewer key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No tasks in this project yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
