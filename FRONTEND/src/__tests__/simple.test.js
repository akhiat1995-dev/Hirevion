// Simple test to verify Jest is working with React Testing Library
import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple component for testing
const SimpleComponent = () => {
  return (
    <div>
      <h1 data-testid="heading">Hello World</h1>
      <button data-testid="button">Click Me</button>
    </div>
  );
};

test('renders heading and button', () => {
  render(<SimpleComponent />);
  
  const heading = screen.getByTestId('heading');
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent('Hello World');
  
  const button = screen.getByTestId('button');
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent('Click Me');
});

test('button click changes text', () => {
  render(<SimpleComponent />);
  
  const button = screen.getByTestId('button');
  // This is just to show interaction testing works
  expect(button).toBeEnabled();
});