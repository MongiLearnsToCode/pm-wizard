import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectWizard } from '@/components/wizard/project-wizard';
import { createClient } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ProjectWizard', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 'org-1' } }),
          }),
        }),
      }),
    });
  });

  it('renders first step', () => {
    render(<ProjectWizard />);
    expect(screen.getByText("What's your project name?")).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(<ProjectWizard />);
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
  });

  it('disables next button when name is empty', () => {
    render(<ProjectWizard />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when name is filled', () => {
    render(<ProjectWizard />);
    const input = screen.getByPlaceholderText(/e.g., Website Redesign/);
    fireEvent.change(input, { target: { value: 'Test Project' } });
    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
  });

  it('has save draft button', () => {
    render(<ProjectWizard />);
    expect(screen.getByText('Save Draft')).toBeInTheDocument();
  });
});
