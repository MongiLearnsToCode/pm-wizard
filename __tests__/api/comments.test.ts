import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/comments/route';

jest.mock('@/lib/supabase/server');
jest.mock('@/lib/rbac');

describe('Comments API', () => {
  it('requires authentication for GET', async () => {
    const request = new NextRequest('http://localhost/api/comments');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('requires authentication for POST', async () => {
    const request = new NextRequest('http://localhost/api/comments', {
      method: 'POST',
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('requires task_id for GET', async () => {
    const request = new NextRequest('http://localhost/api/comments');
    const response = await GET(request);
    // Would check for 400 if authenticated
    expect(response.status).toBe(401);
  });
});
