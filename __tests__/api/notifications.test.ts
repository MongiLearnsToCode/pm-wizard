import { NextRequest } from 'next/server';
import { GET, PATCH } from '@/app/api/notifications/route';

jest.mock('@/lib/supabase/server');

describe('Notifications API', () => {
  it('requires authentication for GET', async () => {
    const request = new NextRequest('http://localhost/api/notifications');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('requires authentication for PATCH', async () => {
    const request = new NextRequest('http://localhost/api/notifications', {
      method: 'PATCH',
    });
    const response = await PATCH(request);
    expect(response.status).toBe(401);
  });
});
