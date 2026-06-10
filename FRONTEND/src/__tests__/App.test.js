// Simple test to verify the app renders
import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders without throwing an error', () => {
  render(<App />);
});