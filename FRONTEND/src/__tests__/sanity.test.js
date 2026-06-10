// Simple sanity test to verify Jest and React Testing Library are working
import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple component for testing
const SanityComponent = () => {
  return (
    <div>
      <h1 data-testid="heading">Hello World</h1>
      <p data-testid="description">This is a test</p>
    </div>
  );
};

test('renders heading and description', () => {
  render(<SanityComponent />);
  
  const heading = screen.getByTestId('heading');
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent('Hello World');
  
  const description = screen.getByTestId('description');
  expect(description).toBeInTheDocument();
  expect(description).toHaveTextContent('This is a test');
});