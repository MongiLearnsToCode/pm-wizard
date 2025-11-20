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
      const taskData = task as any;
      if (taskData.assigned_to) {
        // Create notification
        await (supabase as any).from('notifications').insert({
          user_id: taskData.assigned_to,
          type: 'due_reminder',
          title: 'Task Due Soon',
          content: `${taskData.title} is due soon`,
        });

        // Send email (if email service is configured)
        // await sendDueReminderEmail(
        //   taskData.email,
        //   taskData.title,
        //   new Date(taskData.due_date).toLocaleDateString()
        // );
      }
    }
  }

  return NextResponse.json({ success: true, count: tasks?.length || 0 });
}
