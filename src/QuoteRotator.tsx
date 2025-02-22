import React, { useState, useEffect } from 'react';
import type { Quote } from './types';
import './QuoteRotator.css';

interface QuoteRotatorProps {
  quotes: Quote[];
  interval?: number;
  randomize?: boolean;
  className?: string;
  showSource?: boolean;
  showTags?: boolean;
  onQuoteChange?: (quote: Quote) => void;
}

export function QuoteRotator({ 
  quotes,
  interval = 10000,
  randomize = true,
  className = '',
  showSource = true,
  showTags = true,
  onQuoteChange
}: QuoteRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return randomize ? Math.floor(Math.random() * quotes.length) : 0;
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (quotes.length <= 1) return;

    const timer = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex(current => {
          const newIndex = randomize
            ? Math.floor(Math.random() * quotes.length)
            : (current + 1) % quotes.length;
          
          const nextQuote = quotes[newIndex];
          onQuoteChange?.(nextQuote);
          
          return newIndex;
        });
        setIsVisible(true);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [quotes.length, interval, randomize, onQuoteChange]);

  if (!quotes.length) {
    return null;
  }

  const currentQuote = quotes[currentIndex];

  return (
    <div className={`quote-rotator ${className}`}>
      <blockquote 
        className="quote-content"
        style={{
          transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
        }}
      >
        <p className="quote-text" style={{ cursor: currentQuote.notionUrl ? 'pointer' : 'default' }} onClick={() => {
          if (currentQuote.notionUrl) {
            window.open(currentQuote.notionUrl, '_blank');
          }
        }}>{currentQuote.text}</p>
        <footer className="quote-footer">
          <cite className="quote-author">{currentQuote.author}</cite>
          {showSource && currentQuote.source && (
            <a 
              href={currentQuote.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="quote-source"
            >
              {currentQuote.source.title || 'Source'}
            </a>
          )}
        </footer>
        {showTags && currentQuote.tags && currentQuote.tags.length > 0 && (
          <div className="quote-tags">
            {currentQuote.tags.map(tag => (
              <span key={tag} className="quote-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </blockquote>
    </div>
  );
}
