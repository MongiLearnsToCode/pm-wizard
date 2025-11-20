import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const taskId = request.nextUrl.searchParams.get('task_id');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Get task to check project
  const { data: task } = await supabase
    .from('tasks')
    .select('project_id')
    .eq('id', body.task_id)
    .single();

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const role = await getUserRole(user.id, (task as any).project_id);

  // Only admins and members can comment
  if (role !== 'admin' && role !== 'member') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await (supabase as any)
    .from('comments')
    .insert({
      task_id: body.task_id,
      user_id: user.id,
      content: body.content,
      mentions: body.mentions || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create notifications for mentions
  if (body.mentions?.length) {
    for (const mentionedUserId of body.mentions) {
      await (supabase as any).from('notifications').insert({
        user_id: mentionedUserId,
        type: 'mention',
        title: 'You were mentioned',
        content: `${user.email} mentioned you in a comment`,
        link: `/tasks/${body.task_id}`,
      });
    }
  }

  return NextResponse.json(data);
}
