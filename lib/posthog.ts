import posthog from 'posthog-js'

export type UserRole = 'admin' | 'member' | 'viewer'

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

export const identifyUser = (
  userId: string,
  email: string,
  role: UserRole,
  organizationId?: string
) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, {
      email,
      role,
      organization_id: organizationId,
    })
  }
}

export const trackPageView = (pageName: string, role?: UserRole) => {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', {
      page_name: pageName,
      role,
    })
  }
}

export const resetUser = () => {
  if (typeof window !== 'undefined') {
    posthog.reset()
  }
}
