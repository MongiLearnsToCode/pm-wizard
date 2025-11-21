import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { trackEvent } from '@/lib/posthog';
import { MessageSquare, Paperclip } from 'lucide-react';

interface TaskItemMemberProps {
  task: any;
  onToggle: (id: string, status: string) => void;
  onComment: (task: any) => void;
  onAttach: (task: any) => void;
}

export function TaskItemMember({
  task,
  onToggle,
  onComment,
  onAttach,
}: TaskItemMemberProps) {
  const handleToggle = () => {
    const newStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    if (newStatus === 'completed') {
      trackEvent('task_completed', { role: 'member', task_id: task.id });
    }
    onToggle(task.id, task.status);
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Checkbox
        checked={task.status === 'completed'}
        onCheckedChange={handleToggle}
      />
      <div className="flex-1">
        <p className={task.status === 'completed' ? 'line-through' : ''}>
          {task.title}
        </p>
        {task.due_date && (
          <p className="text-sm text-muted-foreground">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </p>
        )}
      </div>
      <Badge>{task.priority}</Badge>
      <Button size="icon" variant="ghost" onClick={() => onComment(task)}>
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => onAttach(task)}>
        <Paperclip className="h-4 w-4" />
      </Button>
    </div>
  );
}
