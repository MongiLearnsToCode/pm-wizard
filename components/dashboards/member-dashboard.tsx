'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  project_id: string;
}

export function MemberDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchTasks() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .is('deleted_at', null)
        .order('due_date', { ascending: true });

      if (data) {
        setTasks(data);
        const now = new Date();
        const tasksData = data as any[];
        setStats({
          total: tasksData.length,
          completed: tasksData.filter((t) => t.status === 'completed').length,
          inProgress: tasksData.filter((t) => t.status === 'in_progress').length,
          overdue: tasksData.filter(
            (t) =>
              t.due_date &&
              new Date(t.due_date) < now &&
              t.status !== 'completed'
          ).length,
        });
      }
    }

    fetchTasks();
  }, [supabase]);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground">
          Manage your assigned tasks and track progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No tasks assigned yet
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() =>
                      handleToggleTask(task.id, task.status)
                    }
                  />
                  <div className="flex-1">
                    <p
                      className={
                        task.status === 'completed'
                          ? 'line-through text-muted-foreground'
                          : ''
                      }
                    >
                      {task.title}
                    </p>
                    {task.due_date && (
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
