import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeWorkload } from '@/lib/openai';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  const { data: roles } = await supabase
    .from('user_project_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .limit(1);

  if (!roles || roles.length === 0) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const { projectId } = await request.json();

    // Get all tasks for the project
    const { data: tasks } = await supabase
      .from('tasks')
      .select('assignee_id, status')
      .eq('project_id', projectId)
      .not('assignee_id', 'is', null);

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ analysis: null });
    }

    const analysis = await analyzeWorkload(tasks);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('AI workload analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze workload' },
      { status: 500 }
    );
  }
}
