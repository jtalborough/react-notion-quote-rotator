import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuoteRotator } from '../QuoteRotator';

const mockQuotes = [
  {
    id: '1',
    text: 'Test quote',
    author: 'Test Author',
    source: {
      url: 'https://test.com',
      title: 'Test Source'
    },
    tags: ['test'],
  },
];

describe('QuoteRotator', () => {
  it('renders quote text and author', () => {
    render(<QuoteRotator quotes={mockQuotes} />);
    expect(screen.getByText('Test quote')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });
});
