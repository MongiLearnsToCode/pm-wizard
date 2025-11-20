'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRoleStore } from '@/store/role-store';

interface RoleTransitionProps {
  children: ReactNode;
}

export function RoleTransition({ children }: RoleTransitionProps) {
  const { currentRole } = useRoleStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentRole]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
