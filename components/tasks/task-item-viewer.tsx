import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface TaskItemViewerProps {
  task: any;
}

export function TaskItemViewer({ task }: TaskItemViewerProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
      <Eye className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-muted-foreground">{task.title}</p>
        {task.due_date && (
          <p className="text-sm text-muted-foreground">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </p>
        )}
      </div>
      <Badge variant="outline">{task.status}</Badge>
      <Badge variant="outline">{task.priority}</Badge>
    </div>
  );
}
