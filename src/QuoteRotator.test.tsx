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
    source: { url: 'https://example.com', title: 'Source 1' }
  },
  {
    id: '2',
    text: 'Second quote',
    author: 'Author 2'
  }
];

describe('QuoteRotator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the first quote', () => {
    render(<QuoteRotator quotes={mockQuotes} />);
    expect(screen.getByText('First quote')).toBeInTheDocument();
    expect(screen.getByText('Author 1')).toBeInTheDocument();
  });

  it('shows source when available', () => {
    render(<QuoteRotator quotes={mockQuotes} showSource={true} />);
    expect(screen.getByText('Source 1')).toBeInTheDocument();
  });

  it('shows tags when available', () => {
    render(<QuoteRotator quotes={mockQuotes} showTags={true} />);
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
});
