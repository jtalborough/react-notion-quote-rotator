import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { QuoteRotator } from './QuoteRotator';
import type { Quote } from './types';

const mockQuotes: Quote[] = [
  {
    id: '1',
    text: 'First quote',
    author: 'Author 1',
    tags: ['tag1', 'tag2'],
    source: { url: 'https://example.com', title: 'Source 1' },
    visibility: ['public', 'homepage']
  },
  {
    id: '2',
    text: 'Second quote',
    author: 'Author 2',
    visibility: ['private']
  },
  {
    id: '3',
    text: 'Third quote',
    author: 'Author 3',
    visibility: ['public']
  }
];

describe('QuoteRotator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the first quote when not randomized', () => {
    render(<QuoteRotator quotes={mockQuotes} randomize={false} />);
    expect(screen.getByText('First quote')).toBeInTheDocument();
    expect(screen.getByText('Author 1')).toBeInTheDocument();
  });

  it('shows source when available', () => {
    render(<QuoteRotator quotes={mockQuotes} showSource={true} randomize={false} />);
    expect(screen.getByText('Source 1')).toBeInTheDocument();
  });

  it('shows tags when available', () => {
    render(<QuoteRotator quotes={mockQuotes} showTags={true} randomize={false} />);
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('rotates quotes after interval', () => {
    const onQuoteChange = jest.fn();
    render(
      <QuoteRotator
        quotes={mockQuotes}
        interval={1000}
        randomize={false}
        onQuoteChange={onQuoteChange}
      />
    );

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Second quote')).toBeInTheDocument();
    expect(onQuoteChange).toHaveBeenCalledWith(mockQuotes[1]);
  });

  it('returns null when quotes array is empty', () => {
    const { container } = render(<QuoteRotator quotes={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('filters quotes based on visibility', () => {
    render(<QuoteRotator quotes={mockQuotes} visibilityFilter="public" randomize={false} />);
    
    // Should show either First quote or Third quote (both have 'public' visibility)
    const quoteText = screen.getByText(/First quote|Third quote/);
    expect(quoteText).toBeInTheDocument();
    
    // Second quote should never appear as it's not public
    expect(screen.queryByText('Second quote')).not.toBeInTheDocument();
  });

  it('shows all quotes when no visibility filter is set', () => {
    render(<QuoteRotator quotes={mockQuotes} randomize={false} interval={1000} />);
    
    // Should show the first quote initially
    expect(screen.getByText('First quote')).toBeInTheDocument();
    
    // After rotation, should show the second quote
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Wait for the fade transition
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    expect(screen.queryByText('Second quote')).toBeInTheDocument();
  });

  it('handles empty filtered quotes gracefully', () => {
    const { container } = render(<QuoteRotator quotes={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles non-matching visibility filter gracefully', () => {
    const { container } = render(<QuoteRotator quotes={mockQuotes} visibilityFilter="nonexistent" />);
    expect(container.firstChild).toBeNull();
  });
});
