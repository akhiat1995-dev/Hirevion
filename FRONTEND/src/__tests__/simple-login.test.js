import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Simple Login Test', () => {
  test('renders without crashing', () => {
    const Login = () => {
      return (
        <div>
          <h1>Login</h1>
          <input data-testid="email" />
          <input data-testid="password" />
          <button data-testid="submit">Sign In</button>
        </div>
      );
    };

    render(<Login />);
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('submit')).toBeInTheDocument();
  });
});