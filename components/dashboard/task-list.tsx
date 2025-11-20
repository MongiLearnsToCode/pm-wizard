'use client';

import { UserRole } from '@/lib/database.types';
import { TaskItemAdmin } from '@/components/tasks/task-item-admin';
import { TaskItemMember } from '@/components/tasks/task-item-member';
import { TaskItemViewer } from '@/components/tasks/task-item-viewer';

interface TaskListProps {
  tasks: any[];
  userRole: UserRole;
  onToggle: (id: string, status: string) => void;
  onEdit?: (task: any) => void;
  onDelete?: (id: string) => void;
  onComment?: (task: any) => void;
  onAttach?: (task: any) => void;
}

export function TaskList({
  tasks,
  userRole,
  onToggle,
  onEdit,
  onDelete,
  onComment,
  onAttach,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No tasks available</p>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        if (userRole === 'admin') {
          return (
            <TaskItemAdmin
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit!}
              onDelete={onDelete!}
            />
          );
        }

        if (userRole === 'member') {
          return (
            <TaskItemMember
              key={task.id}
              task={task}
              onToggle={onToggle}
              onComment={onComment!}
              onAttach={onAttach!}
            />
          );
        }

        return <TaskItemViewer key={task.id} task={task} />;
      })}
    </div>
  );
}
