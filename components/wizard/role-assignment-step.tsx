'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TeamRoleSelector } from '@/components/teams/team-role-selector';
import { UserRole } from '@/lib/database.types';

interface RoleAssignment {
  userId: string;
  userName: string;
  role: UserRole;
}

interface RoleAssignmentStepProps {
  value: RoleAssignment[];
  onChange: (assignments: RoleAssignment[]) => void;
}

export function RoleAssignmentStep({
  value,
  onChange,
}: RoleAssignmentStepProps) {
  const [users, setUsers] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from('profiles').select('*');
      setUsers(data || []);
    }
    fetchUsers();
  }, [supabase]);

  const handleToggle = (userId: string, userName: string) => {
    const exists = value.find((a) => a.userId === userId);
    if (exists) {
      onChange(value.filter((a) => a.userId !== userId));
    } else {
      onChange([...value, { userId, userName, role: 'member' }]);
    }
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    onChange(
      value.map((a) => (a.userId === userId ? { ...a, role } : a))
    );
  };

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const assignment = value.find((a) => a.userId === user.id);
        return (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={!!assignment}
                onCheckedChange={() =>
                  handleToggle(user.id, user.full_name || 'Unknown')
                }
              />
              <Label>{user.full_name || user.id}</Label>
            </div>
            {assignment && (
              <TeamRoleSelector
                value={assignment.role}
                onChange={(role) => handleRoleChange(user.id, role)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
