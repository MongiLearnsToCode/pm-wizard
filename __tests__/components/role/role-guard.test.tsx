import { render, screen } from '@testing-library/react';
import { RoleGuard } from '@/components/role/role-guard';
import { useRole } from '@/hooks/use-role';

jest.mock('@/hooks/use-role');

describe('RoleGuard', () => {
  it('renders children when role is allowed', () => {
    (useRole as jest.Mock).mockReturnValue({ role: 'admin', loading: false });

    render(
      <RoleGuard allowedRoles={['admin']}>
        <div>Admin Content</div>
      </RoleGuard>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('renders fallback when role is not allowed', () => {
    (useRole as jest.Mock).mockReturnValue({ role: 'viewer', loading: false });

    render(
      <RoleGuard allowedRoles={['admin']} fallback={<div>Access Denied</div>}>
        <div>Admin Content</div>
      </RoleGuard>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('renders nothing when loading', () => {
    (useRole as jest.Mock).mockReturnValue({ role: null, loading: true });

    const { container } = render(
      <RoleGuard allowedRoles={['admin']}>
        <div>Admin Content</div>
      </RoleGuard>
    );

    expect(container.firstChild).toBeNull();
  });

  it('allows multiple roles', () => {
    (useRole as jest.Mock).mockReturnValue({ role: 'member', loading: false });

    render(
      <RoleGuard allowedRoles={['admin', 'member']}>
        <div>Content</div>
      </RoleGuard>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
