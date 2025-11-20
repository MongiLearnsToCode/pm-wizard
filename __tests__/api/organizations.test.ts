import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/organizations/route';

jest.mock('@/lib/supabase/server');

describe('Organizations API', () => {
  it('requires authentication for GET', async () => {
    const request = new NextRequest('http://localhost/api/organizations');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('requires authentication for POST', async () => {
    const request = new NextRequest('http://localhost/api/organizations', {
      method: 'POST',
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
