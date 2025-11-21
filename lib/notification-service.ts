import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@/lib/database.types';

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  content: string,
  link?: string
) {
  const supabase = await createClient();

  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    content,
    link,
  } as any);
}

// Role-specific notification triggers
export async function notifyTaskAssignment(
  taskId: string,
  assignedUserId: string,
  taskTitle: string
) {
  await createNotification(
    assignedUserId,
    'task_assigned',
    'New Task Assigned',
    `You have been assigned: ${taskTitle}`,
    `/tasks/${taskId}`
  );
}

export async function notifyMention(
  mentionedUserId: string,
  mentionerName: string,
  taskId: string
) {
  await createNotification(
    mentionedUserId,
    'mention',
    'You were mentioned',
    `${mentionerName} mentioned you in a comment`,
    `/tasks/${taskId}`
  );
}

export async function notifyProjectUpdate(
  projectId: string,
  userIds: string[],
  message: string
) {
  for (const userId of userIds) {
    await createNotification(
      userId,
      'project_update',
      'Project Updated',
      message,
      `/projects/${projectId}`
    );
  }
}

export async function notifyDueDate(
  userId: string,
  taskTitle: string,
  dueDate: string
) {
  await createNotification(
    userId,
    'due_reminder',
    'Task Due Soon',
    `${taskTitle} is due on ${dueDate}`,
    undefined
  );
}

export async function notifyMilestoneComplete(
  projectId: string,
  viewerIds: string[],
  milestoneName: string
) {
  // Notify viewers about milestone completion
  for (const userId of viewerIds) {
    await createNotification(
      userId,
      'milestone_complete',
      'Milestone Completed',
      `${milestoneName} has been completed`,
      `/projects/${projectId}`
    );
  }
}
