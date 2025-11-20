import { render, screen } from '@testing-library/react';
import { MemberDashboard } from '@/components/dashboards/member-dashboard';
import { createClient } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client');

describe('MemberDashboard', () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({ data: [] }),
            }),
          }),
        }),
      }),
    });
  });

  it('renders dashboard title', () => {
    render(<MemberDashboard />);
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
  });

  it('renders stat cards', () => {
    render(<MemberDashboard />);
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('renders task list', () => {
    render(<MemberDashboard />);
    expect(screen.getByText('Task List')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    render(<MemberDashboard />);
    expect(screen.getByText('No tasks assigned yet')).toBeInTheDocument();
  });
});
