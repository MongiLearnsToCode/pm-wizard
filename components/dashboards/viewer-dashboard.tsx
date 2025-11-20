'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  Users,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ViewerDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    completionRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: projects } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .is('deleted_at', null);

      const { data: completedProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('status', 'completed')
        .is('deleted_at', null);

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .is('deleted_at', null);

      const { data: completedTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('status', 'completed')
        .is('deleted_at', null);

      const { data: members } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      const totalProjects = projects?.length || 0;
      const totalTasks = tasks?.length || 0;
      const completed = completedTasks?.length || 0;

      setStats({
        totalProjects,
        completedProjects: completedProjects?.length || 0,
        totalTasks,
        completedTasks: completed,
        teamMembers: members?.length || 0,
        completionRate: totalTasks > 0 ? (completed / totalTasks) * 100 : 0,
      });

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('tasks')
        .select('*, projects(name)')
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(5);

      setRecentActivity(activity || []);
    }

    fetchData();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Eye className="h-8 w-8 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor project progress and team performance
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedProjects}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completionRate.toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{stats.completionRate.toFixed(0)}%</span>
              </div>
              <Progress value={stats.completionRate} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">
                  {stats.totalProjects - stats.completedProjects}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Tasks Remaining</p>
                <p className="text-2xl font-bold">
                  {stats.totalTasks - stats.completedTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-muted-foreground">
                        {item.projects?.name}
                      </p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
