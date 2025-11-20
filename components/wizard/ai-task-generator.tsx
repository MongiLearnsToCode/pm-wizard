'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Task {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface AiTaskGeneratorProps {
  projectGoal: string;
  onTasksGenerated: (tasks: Task[]) => void;
}

export function AiTaskGenerator({ projectGoal, onTasksGenerated }: AiTaskGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleGenerateTasks = async () => {
    if (!projectGoal || projectGoal.length < 10) return;

    setLoading(true);
    setTasks([]);

    try {
      const response = await fetch('/api/ai/suggest-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectGoal, stream: false }),
      });

      const data = await response.json();
      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
        onTasksGenerated(data.tasks);
      }
    } catch (error) {
      console.error('Failed to generate tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-purple-600" />
          AI Task Generator
        </CardTitle>
        <CardDescription>
          Generate task breakdown from your project goal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGenerateTasks}
          disabled={loading || !projectGoal || projectGoal.length < 10}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Tasks...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Tasks with AI
            </>
          )}
        </Button>

        {tasks.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Generated Tasks ({tasks.length})</p>
            {tasks.map((task, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white p-3 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(task.priority)} variant="secondary">
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
