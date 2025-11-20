import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/tasks/route';

jest.mock('@/lib/supabase/server');
jest.mock('@/lib/rbac');

describe('Tasks API', () => {
  it('requires authentication for GET', async () => {
    const request = new NextRequest('http://localhost/api/tasks');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('requires authentication for POST', async () => {
    const request = new NextRequest('http://localhost/api/tasks', {
      method: 'POST',
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
