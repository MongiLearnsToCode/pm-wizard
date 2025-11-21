import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

export function useRole(projectId?: string) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRole() {
      if (!projectId) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.rpc('get_user_project_role', {
        p_user_id: user.id,
        p_project_id: projectId,
      } as any);

      setRole(data as UserRole | null);
      setLoading(false);
    }

    fetchRole();
  }, [projectId, supabase]);

  return { role, loading };
}
