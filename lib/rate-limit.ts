import { UserRole } from '@/lib/database.types';

const RATE_LIMITS: Record<UserRole, { requests: number; window: number }> = {
  admin: { requests: 1000, window: 60 }, // 1000 req/min
  member: { requests: 500, window: 60 }, // 500 req/min
  viewer: { requests: 200, window: 60 }, // 200 req/min
};

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string, role: UserRole): boolean {
  const limit = RATE_LIMITS[role];
  const key = `${userId}:${role}`;
  const now = Date.now();

  const record = requestCounts.get(key);

  if (!record || now > record.resetAt) {
    requestCounts.set(key, {
      count: 1,
      resetAt: now + limit.window * 1000,
    });
    return true;
  }

  if (record.count >= limit.requests) {
    return false;
  }

  record.count++;
  return true;
}

export function getRateLimitInfo(role: UserRole) {
  return RATE_LIMITS[role];
}
