'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserRole } from '@/lib/database.types';

interface CommentThreadProps {
  taskId: string;
  userRole: UserRole;
}

export function CommentThread({ taskId, userRole }: CommentThreadProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  async function fetchComments() {
    const response = await fetch(`/api/comments?task_id=${taskId}`);
    const data = await response.json();
    setComments(data);
  }

  const handlePost = async () => {
    if (!newComment.trim()) return;

    // Extract mentions (@username)
    const mentions = newComment.match(/@(\w+)/g)?.map((m) => m.slice(1)) || [];

    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: taskId,
        content: newComment,
        mentions,
      }),
    });

    setNewComment('');
    fetchComments();
  };

  const canComment = userRole === 'admin' || userRole === 'member';

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Comments</h4>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border p-3">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium">
                {comment.profiles?.full_name || 'Unknown'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>

      {canComment && (
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment... (use @username to mention)"
          />
          <Button onClick={handlePost} size="sm">
            Post Comment
          </Button>
        </div>
      )}

      {!canComment && (
        <p className="text-sm text-muted-foreground">
          View only - cannot add comments
        </p>
      )}
    </div>
  );
}
