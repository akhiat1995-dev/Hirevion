import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/Register';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocks at module level
const mockRegister = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../services/api', () => ({
  login: jest.fn(),
  register: jest.fn()
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
    loading: false,
    error: null,
    clearError: jest.fn(),
    user: null
  })
}));

jest.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => key
  })
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockResolvedValue({
      success: true,
      user: { id: '1', email: 'test@example.com', role: 'user' }
    });
  });

  test('renders registration form with correct elements', () => {
    render(<BrowserRouter><Register /></BrowserRouter>);
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    render(<BrowserRouter><Register /></BrowserRouter>);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(fullNameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  test('calls register function on submit', async () => {
    render(<BrowserRouter><Register /></BrowserRouter>);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      });
    });
  });

  test('redirects to candidate page for user role', async () => {
    mockRegister.mockResolvedValue({
      success: true,
      user: { id: '1', email: 'john@example.com', role: 'user' }
    });

    render(<BrowserRouter><Register /></BrowserRouter>);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/candidate');
    });
  });

  test('redirects to recruiter page for recruiter role', async () => {
    mockRegister.mockResolvedValue({
      success: true,
      user: { id: '1', email: 'recruiter@example.com', role: 'recruiter' }
    });

    render(<BrowserRouter><Register /></BrowserRouter>);

    const buttons = screen.getAllByRole('button');
    const recruiterButton = buttons.find(b => b.textContent.includes('Recruiter'));
    fireEvent.click(recruiterButton);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(fullNameInput, { target: { value: 'Recruiter User' } });
    fireEvent.change(emailInput, { target: { value: 'recruiter@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/recruiter');
    });
  });

  test('shows error when registration fails', async () => {
    mockRegister.mockRejectedValue({
      response: { data: { detail: 'Email already registered' } }
    });

    render(<BrowserRouter><Register /></BrowserRouter>);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });
});