import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isOrgAdmin } from '@/lib/rbac';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await isOrgAdmin(user.id, params.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { email, role } = body;

  // Create notification for invited user (simplified)
  // In production, send actual email via Resend
  await supabase.from('notifications').insert({
    user_id: user.id,
    type: 'invitation',
    title: 'Organization Invitation',
    content: `Invited ${email} as ${role}`,
  });

  return NextResponse.json({ success: true });
}
