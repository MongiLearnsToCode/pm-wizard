'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/lib/posthog'
import { useAuthStore } from '@/store/auth-store'
import { useRoleStore } from '@/store/role-store'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const user = useAuthStore((state) => state.user)
  const currentRole = useRoleStore((state) => state.currentRole)

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, currentRole || undefined)
    }
  }, [pathname, searchParams, currentRole])

  return <>{children}</>
}
