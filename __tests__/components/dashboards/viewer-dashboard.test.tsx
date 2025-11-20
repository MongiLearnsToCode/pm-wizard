import { render, screen } from '@testing-library/react';
import { ViewerDashboard } from '@/components/dashboards/viewer-dashboard';
import { createClient } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client');

describe('ViewerDashboard', () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({ data: [] }),
            }),
            order: jest.fn().mockResolvedValue({ data: [] }),
          }),
          is: jest.fn().mockResolvedValue({ data: [] }),
          order: jest.fn().mockResolvedValue({ data: [] }),
        }),
      }),
    });
  });

  it('renders dashboard title', () => {
    render(<ViewerDashboard />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('renders stat cards', () => {
    render(<ViewerDashboard />);
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('Team Size')).toBeInTheDocument();
  });

  it('renders project health section', () => {
    render(<ViewerDashboard />);
    expect(screen.getByText('Project Health')).toBeInTheDocument();
  });

  it('renders recent activity section', () => {
    render(<ViewerDashboard />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('shows read-only indicators', () => {
    render(<ViewerDashboard />);
    // Verify no edit buttons exist
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
});
