'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskItemMember } from '@/components/tasks/task-item-member';
import { X, Paperclip } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MemberProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (selectedTask) {
      loadComments(selectedTask.id);
    }
  }, [selectedTask]);

  async function loadProject() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    setProject(data);
  }

  async function loadTasks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('assigned_to', user.id)
      .order('created_at', { ascending: false });
    setTasks(data || []);
  }

  async function loadComments(taskId: string) {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(email)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    setComments(data || []);
  }

  async function handleToggle(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
    await (supabase as any)
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);
    loadTasks();
  }

  async function handleAddComment() {
    if (!newComment.trim() || !selectedTask) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase as any).from('comments').insert({
      task_id: selectedTask.id,
      user_id: user.id,
      content: newComment,
    });

    setNewComment('');
    loadComments(selectedTask.id);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedTask) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', selectedTask.id);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await (supabase as any).from('comments').insert({
            task_id: selectedTask.id,
            user_id: user.id,
            content: `📎 Uploaded file: ${file.name}`,
          });
          loadComments(selectedTask.id);
        }
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleTaskAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const taskId = e.target.dataset.taskId;
    if (!file || !taskId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await (supabase as any).from('comments').insert({
            task_id: taskId,
            user_id: user.id,
            content: `📎 Attached file: ${file.name}`,
          });
        }
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  if (!project) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <Badge>{project.status}</Badge>
        </div>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id}>
              <TaskItemMember
                task={task}
                onToggle={handleToggle}
                onComment={(task) => setSelectedTask(task)}
                onAttach={() => {
                  const input = document.getElementById(`file-${task.id}`) as HTMLInputElement;
                  input?.click();
                }}
              />
              <input
                id={`file-${task.id}`}
                type="file"
                className="hidden"
                data-task-id={task.id}
                onChange={handleTaskAttachment}
                accept="image/*,.pdf,.doc,.docx,.txt"
                disabled={uploading}
              />
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No tasks assigned to you in this project
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Discussion: {selectedTask?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{(comment.profiles as any)?.email || 'User'}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No comments yet. Start the conversation!
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Ask the admin for clarity or discuss this task..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Send Message
                </Button>
                <Button variant="outline" disabled={uploading} asChild>
                  <label className="cursor-pointer">
                    <Paperclip className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Attach File'}
                    <Input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </label>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
