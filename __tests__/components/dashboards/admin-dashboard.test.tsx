import { render, screen } from '@testing-library/react';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { createClient } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockResolvedValue({ data: [], count: 0 }),
          }),
          is: jest.fn().mockResolvedValue({ data: [], count: 0 }),
        }),
      }),
    });
  });

  it('renders dashboard title', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('renders stat cards', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();
  });

  it('renders quick actions', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Create Project')).toBeInTheDocument();
  });

  it('renders new project button', () => {
    render(<AdminDashboard />);
    const buttons = screen.getAllByText('New Project');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
