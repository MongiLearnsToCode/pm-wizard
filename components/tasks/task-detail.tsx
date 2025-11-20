'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/lib/database.types';

interface TaskDetailProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

export function TaskDetail({
  taskId,
  isOpen,
  onClose,
  userRole = 'viewer',
}: TaskDetailProps) {
  const [task, setTask] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (taskId && isOpen) {
      fetchTask();
      fetchComments();
    }
  }, [taskId, isOpen]);

  async function fetchTask() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    setTask(data);
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    setComments(data || []);
  }

  const handleAddComment = async () => {
    if (!taskId || !comment.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('comments').insert({
      task_id: taskId,
      user_id: user.id,
      content: comment,
    });

    setComment('');
    fetchComments();
  };

  const canEdit = userRole === 'admin' || userRole === 'member';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>

        {task && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            </div>

            <div className="flex gap-2">
              <Badge>{task.status}</Badge>
              <Badge variant="outline">{task.priority}</Badge>
            </div>

            {task.due_date && (
              <div>
                <Label>Due Date</Label>
                <p className="text-sm">
                  {new Date(task.due_date).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold">Comments</h4>
              <div className="space-y-2">
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg border p-3">
                    <p className="text-sm font-medium">
                      {c.profiles?.full_name || 'Unknown'}
                    </p>
                    <p className="text-sm">{c.content}</p>
                  </div>
                ))}
              </div>

              {canEdit && (
                <div className="space-y-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                  />
                  <Button onClick={handleAddComment} size="sm">
                    Post Comment
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
