import { ReactNode } from 'react';
import { MemberNav } from '@/components/navigation/member-nav';

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <MemberNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
