'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban, CheckCircle2, Users } from 'lucide-react';
import Link from 'next/link';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    teamMembers: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const { data: projects } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .is('deleted_at', null);

      const { data: activeProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .is('deleted_at', null);

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('status', 'completed')
        .is('deleted_at', null);

      const { data: members } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      setStats({
        totalProjects: projects?.length || 0,
        activeProjects: activeProjects?.length || 0,
        completedTasks: tasks?.length || 0,
        teamMembers: members?.length || 0,
      });
    }

    fetchStats();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage projects, teams, and organization
          </p>
        </div>
        <Link href="/admin/wizard">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/admin/wizard">
            <Button>Create Project</Button>
          </Link>
          <Link href="/admin/teams">
            <Button variant="outline">Manage Teams</Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline">Organization Settings</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
