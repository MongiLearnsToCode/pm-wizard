import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@/lib/database.types';

export async function addMemberToOrg(
  orgId: string,
  userId: string,
  role: UserRole
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_organization_roles')
    .insert({
      organization_id: orgId,
      user_id: userId,
      role,
    })
    .select()
    .single();

  return { data, error };
}

export async function removeMemberFromOrg(orgId: string, userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_organization_roles')
    .delete()
    .eq('organization_id', orgId)
    .eq('user_id', userId);

  return { error };
}

export async function updateMemberRole(
  orgId: string,
  userId: string,
  role: UserRole
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_organization_roles')
    .update({ role })
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
}

export async function getOrgMembers(orgId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_organization_roles')
    .select('*, profiles(*)')
    .eq('organization_id', orgId);

  return { data, error };
}
