'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/posthog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ViewerAnalyticsPage() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    completionRate: 0,
    totalTasks: 0,
    teamSize: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    trackEvent('analytics_viewed', { role: 'viewer' });
    loadStats();
  }, []);

  async function loadStats() {
    const [projects, tasks, completed, members] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('tasks').select('id', { count: 'exact', head: true }),
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('user_project_roles').select('user_id', { count: 'exact', head: true }),
    ]);

    const totalTasks = tasks.count || 0;
    const completedTasks = completed.count || 0;
    const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setStats({
      activeProjects: projects.count || 0,
      completionRate: rate,
      totalTasks,
      teamSize: members.count || 0,
    });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics Overview</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.completionRate}%</p>
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
            <CardTitle>Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.teamSize}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
