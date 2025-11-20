import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Checkbox
        checked={task.status === 'completed'}
        onCheckedChange={() => onToggle(task.id, task.status)}
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
