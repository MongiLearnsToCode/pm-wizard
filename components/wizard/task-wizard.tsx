'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskWizardProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TaskWizard({
  projectId,
  open,
  onClose,
  onSuccess,
}: TaskWizardProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [task, setTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium',
    due_date: '',
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchMembers() {
      const { data } = await supabase
        .from('user_project_roles')
        .select('user_id, role, profiles(*)')
        .eq('project_id', projectId)
        .in('role', ['admin', 'member']);

      setMembers(data || []);
    }

    if (open) {
      fetchMembers();
    }
  }, [open, projectId, supabase]);

  const handleCreate = async () => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...task,
        project_id: projectId,
        assigned_to: task.assigned_to || null,
        due_date: task.due_date || null,
      }),
    });

    setTask({
      title: '',
      description: '',
      assigned_to: '',
      priority: 'medium',
      due_date: '',
    });
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Task Title</Label>
            <Input
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              placeholder="Task details..."
            />
          </div>

          <div className="space-y-2">
            <Label>Assign To (Member)</Label>
            <Select
              value={task.assigned_to}
              onValueChange={(v) => setTask({ ...task, assigned_to: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.user_id} value={member.user_id}>
                    {member.profiles?.full_name || 'Unknown'} ({member.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={task.priority}
              onValueChange={(v) => setTask({ ...task, priority: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={task.due_date}
              onChange={(e) => setTask({ ...task, due_date: e.target.value })}
            />
          </div>

          <Button onClick={handleCreate} className="w-full" disabled={!task.title}>
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
