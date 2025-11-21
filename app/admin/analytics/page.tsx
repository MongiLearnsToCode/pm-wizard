'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/posthog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalMembers: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    trackEvent('analytics_viewed', { role: 'admin' });
    loadStats();
  }, []);

  async function loadStats() {
    const [projects, tasks, completedTasks, members] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('tasks').select('id', { count: 'exact', head: true }),
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('user_project_roles').select('user_id', { count: 'exact', head: true }),
    ]);

    setStats({
      totalProjects: projects.count || 0,
      totalTasks: tasks.count || 0,
      completedTasks: completedTasks.count || 0,
      totalMembers: members.count || 0,
    });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.completedTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalMembers}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
