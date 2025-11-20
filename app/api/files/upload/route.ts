import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/rbac';
import { uploadFile } from '@/lib/cloudflare-r2';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const taskId = formData.get('task_id') as string;

  if (!file || !taskId) {
    return NextResponse.json(
      { error: 'File and task_id required' },
      { status: 400 }
    );
  }

  // Get task to check project
  const { data: task } = await supabase
    .from('tasks')
    .select('project_id')
    .eq('id', taskId)
    .single();

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const role = await getUserRole(user.id, task.project_id);

  // Only admins and members can upload
  if (role !== 'admin' && role !== 'member') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${taskId}/${Date.now()}-${file.name}`;

  await uploadFile(key, buffer, file.type);

  // Save file record
  const { data, error } = await supabase
    .from('files')
    .insert({
      task_id: taskId,
      uploaded_by: user.id,
      filename: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: key,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
