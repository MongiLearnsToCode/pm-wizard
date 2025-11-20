import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateTaskBreakdown, streamTaskBreakdown } from '@/lib/openai';

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
    const { projectGoal, stream } = await request.json();

    if (!projectGoal || projectGoal.length < 10) {
      return NextResponse.json(
        { error: 'Project goal must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (stream) {
      const aiStream = await streamTaskBreakdown(projectGoal);
      
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of aiStream) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(content));
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const tasks = await generateTaskBreakdown(projectGoal);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('AI task breakdown error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    );
  }
}
