'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Organization {
  id: string;
  name: string;
}

export function OrgSelector() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrgs() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_organization_roles')
        .select('organization_id, organizations(id, name)')
        .eq('user_id', user.id);

      if (data) {
        const organizations = data
          .map((item: any) => item.organizations)
          .filter(Boolean);
        setOrgs(organizations);
        if (organizations.length > 0) {
          setCurrentOrg(organizations[0].id);
        }
      }
    }

    fetchOrgs();
  }, [supabase]);

  if (orgs.length <= 1) return null;

  return (
    <Select value={currentOrg} onValueChange={setCurrentOrg}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {orgs.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
