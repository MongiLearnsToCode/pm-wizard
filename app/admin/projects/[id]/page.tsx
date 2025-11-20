'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskWizard } from '@/components/wizard/task-wizard';
import { TaskList } from '@/components/dashboard/task-list';

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, []);

  async function fetchProject() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();
    setProject(data);
  }

  async function fetchTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', params.id)
      .is('deleted_at', null);
    setTasks(data || []);
  }

  const handleToggle = async (id: string, status: string) => {
    const newStatus = status === 'completed' ? 'todo' : 'completed';
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project?.name}</h1>
          <p className="text-muted-foreground">{project?.description}</p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={tasks}
            userRole="admin"
            onToggle={handleToggle}
            onEdit={() => {}}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <TaskWizard
        projectId={params.id}
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSuccess={fetchTasks}
      />
    </div>
  );
}
