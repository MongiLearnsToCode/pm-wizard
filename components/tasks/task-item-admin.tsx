import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';

interface TaskItemAdminProps {
  task: any;
  onToggle: (id: string, status: string) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
}

export function TaskItemAdmin({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemAdminProps) {
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
      <Button size="icon" variant="ghost" onClick={() => onEdit(task)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
