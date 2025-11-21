import { createClient } from '@/lib/supabase/server';

export async function logRoleChange(
  userId: string,
  targetUserId: string,
  oldRole: string,
  newRole: string,
  context: string
) {
  const supabase = await createClient();

  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'audit_log',
    title: 'Role Changed',
    content: `Changed ${targetUserId} from ${oldRole} to ${newRole} in ${context}`,
  } as any);
}
