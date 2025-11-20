import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendDueReminderEmail } from '@/lib/resend';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get tasks due in next 24 hours
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .lt('due_date', tomorrow.toISOString())
    .eq('status', 'todo')
    .is('deleted_at', null);

  if (tasks) {
    for (const task of tasks) {
      if (task.assigned_to && task.profiles) {
        // Create notification
        await supabase.from('notifications').insert({
          user_id: task.assigned_to,
          type: 'due_reminder',
          title: 'Task Due Soon',
          content: `${task.title} is due soon`,
        });

        // Send email
        await sendDueReminderEmail(
          task.profiles.email,
          task.title,
          new Date(task.due_date).toLocaleDateString()
        );
      }
    }
  }

  return NextResponse.json({ success: true, count: tasks?.length || 0 });
}
