'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/posthog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MemberAnalyticsPage() {
  const [stats, setStats] = useState({
    myTasks: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    trackEvent('analytics_viewed', { role: 'member' });
    loadStats();
  }, []);

  async function loadStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [myTasks, completed, inProgress, overdue] = await Promise.all([
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('assigned_to', user.id),
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('assigned_to', user.id).eq('status', 'completed'),
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('assigned_to', user.id).eq('status', 'in_progress'),
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('assigned_to', user.id).lt('due_date', new Date().toISOString()).neq('status', 'completed'),
    ]);

    setStats({
      myTasks: myTasks.count || 0,
      completed: completed.count || 0,
      inProgress: inProgress.count || 0,
      overdue: overdue.count || 0,
    });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Analytics</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.myTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{stats.overdue}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
