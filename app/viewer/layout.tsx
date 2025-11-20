import { ReactNode } from 'react';
import { ViewerNav } from '@/components/navigation/viewer-nav';

export default function ViewerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ViewerNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
