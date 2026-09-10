import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchPage from './page';

vi.mock('next/navigation', () => ({
  useRouter() {
    return { push: vi.fn() };
  }
}));

describe('SearchPage UI Component', () => {
  it('renders the search title correctly', () => {
    render(<SearchPage />);
    expect(screen.getByText(/عايز تدور على إيه/i)).toBeInTheDocument();
  });
  
  it('renders the search button', () => {
    render(<SearchPage />);
    expect(screen.getByRole('button', { name: /يلا دوّر/i })).toBeInTheDocument();
  });
});
