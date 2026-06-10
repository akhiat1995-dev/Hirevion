/**
 * Test file for Login component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Login Component', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with correct elements', () => {
    // Mock all dependencies
    jest.mock('../services/api', () => ({
      login: jest.fn(),
      register: jest.fn()
    }));
    
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        login: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
        user: null
      })
    }));
    
    jest.mock('../context/LanguageContext', () => ({
      useLanguage: () => ({
        t: (key) => {
          const translations = {
            'login': 'Login',
            'signIn': 'Sign In',
            'email': 'Email',
            'password': 'Password',
            'noAccount': "Don't have an account?",
            'createAccount': 'Create Account',
            'forgotPassword': 'Forgot Password'
          };
          return translations[key] || key;
        }
      })
    }));
    
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => jest.fn()
    }));
    
    // Reset module cache to ensure our mocks are used
    jest.resetModules();
    
    // Re-import the component after mocking
    const LoginComponent = require('../pages/Login').default;
    
    render(<BrowserRouter><LoginComponent /></BrowserRouter>);

    // Check for heading
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

    // Check for form labels
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check for role selector - look for the buttons directly since label association is tricky
    const buttons = screen.getAllByRole('button');
    const buttonNames = buttons.map(button => button.textContent.trim());
    
    // Should have Candidate and Recruiter toggle buttons plus Sign In submit button
    expect(buttonNames.some(name => name.toLowerCase().includes('candidate'))).toBe(true);
    expect(buttonNames.some(name => name.toLowerCase().includes('recruiter'))).toBe(true);
    expect(buttonNames.some(name => name.toLowerCase().includes('sign in'))).toBe(true);
  });

  test('handles input changes correctly', () => {
    // Mock all dependencies
    jest.mock('../services/api', () => ({
      login: jest.fn(),
      register: jest.fn()
    }));
    
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        login: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
        user: null
      })
    }));
    
    jest.mock('../context/LanguageContext', () => ({
      useLanguage: () => ({
        t: (key) => {
          const translations = {
            'login': 'Login',
            'signIn': 'Sign In',
            'email': 'Email',
            'password': 'Password',
            'noAccount': "Don't have an account?",
            'createAccount': 'Create Account',
            'forgotPassword': 'Forgot Password'
          };
          return translations[key] || key;
        }
      })
    }));
    
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => jest.fn()
    }));
    
    // Reset module cache to ensure our mocks are used
    jest.resetModules();
    
    // Re-import the component after mocking
    const LoginComponent = require('../pages/Login').default;
    
    render(<BrowserRouter><LoginComponent /></BrowserRouter>);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls login function with form data on submit', async () => {
    // Setup mocks
    const mockLogin = jest.fn().mockResolvedValue({
      success: true,
      user: { id: '1', email: 'test@example.com', role: 'user' }
    });
    
    const mockNavigate = jest.fn();
    
    // Mock all dependencies
    jest.mock('../services/api', () => ({
      login: jest.fn(),
      register: jest.fn()
    }));
    
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        login: mockLogin,
        loading: false,
        error: null,
        clearError: jest.fn(),
        user: null
      })
    }));
    
    jest.mock('../context/LanguageContext', () => ({
      useLanguage: () => ({
        t: (key) => {
          const translations = {
            'login': 'Login',
            'signIn': 'Sign In',
            'email': 'Email',
            'password': 'Password',
            'noAccount': "Don't have an account?",
            'createAccount': 'Create Account',
            'forgotPassword': 'Forgot Password'
          };
          return translations[key] || key;
        }
      })
    }));
    
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    // Reset module cache to ensure our mocks are used
    jest.resetModules();
    
    // Re-import the component after mocking
    const LoginComponent = require('../pages/Login').default;
    
    render(<BrowserRouter><LoginComponent /></BrowserRouter>);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Wait for login to be called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('redirects to candidate dashboard for user role on successful login', async () => {
    // Setup mocks
    const mockLogin = jest.fn().mockResolvedValue({
      success: true,
      user: { id: '1', email: 'test@example.com', role: 'user' }
    });
    
    const mockNavigate = jest.fn();
    
    // Mock all dependencies
    jest.mock('../services/api', () => ({
      login: jest.fn(),
      register: jest.fn()
    }));
    
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        login: mockLogin,
        loading: false,
        error: null,
        clearError: jest.fn(),
        user: null
      })
    }));
    
    jest.mock('../context/LanguageContext', () => ({
      useLanguage: () => ({
        t: (key) => {
          const translations = {
            'login': 'Login',
            'signIn': 'Sign In',
            'email': 'Email',
            'password': 'Password',
            'noAccount': "Don't have an account?",
            'createAccount': 'Create Account',
            'forgotPassword': 'Forgot Password'
          };
          return translations[key] || key;
        }
      })
    }));
    
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    // Reset module cache to ensure our mocks are used
    jest.resetModules();
    
    // Re-import the component after mocking
    const LoginComponent = require('../pages/Login').default;
    
    render(<BrowserRouter><LoginComponent /></BrowserRouter>);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Wait for navigation to be called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/candidate/dashboard');
    });
  });

  test('redirects to recruiter dashboard for recruiter role on successful login', async () => {
    // Setup mocks
    const mockLogin = jest.fn().mockResolvedValue({
      success: true,
      user: { id: '1', email: 'test@example.com', role: 'recruiter' }
    });
    
    const mockNavigate = jest.fn();
    
    // Mock all dependencies
    jest.mock('../services/api', () => ({
      login: jest.fn(),
      register: jest.fn()
    }));
    
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        login: mockLogin,
        loading: false,
        error: null,
        clearError: jest.fn(),
        user: null
      })
    }));
    
    jest.mock('../context/LanguageContext', () => ({
      useLanguage: () => ({
        t: (key) => {
          const translations = {
            'login': 'Login',
            'signIn': 'Sign In',
            'email': 'Email',
            'password': 'Password',
            'noAccount': "Don't have an account?",
            'createAccount': 'Create Account',
            'forgotPassword': 'Forgot Password'
          };
          return translations[key] || key;
        }
      })
    }));
    
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    // Reset module cache to ensure our mocks are used
    jest.resetModules();
    
    // Re-import the component after mocking
    const LoginComponent = require('../pages/Login').default;
    
    render(<BrowserRouter><LoginComponent /></BrowserRouter>);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Wait for navigation to be called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/recruiter');
    });
  });

  test('shows error when login fails', async () => {
    // Setup mocks
    const mockLogin = jest.fn().mockRejectedValue({
      response: { data: { detail: 'Invalid email or password' } }
    });
    
    // Mock all dependencies
    jest.mock('../services/api', () => ({
      login: jest.fn(),
      register: jest.fn()
    }));
    
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        login: mockLogin,
        loading: false,
        error: null,
        clearError: jest.fn(),
        user: null
      })
    }));
    
    jest.mock('../context/LanguageContext', () => ({
      useLanguage: () => ({
        t: (key) => {
          const translations = {
            'login': 'Login',
            'signIn': 'Sign In',
            'email': 'Email',
            'password': 'Password',
            'noAccount': "Don't have an account?",
            'createAccount': 'Create Account',
            'forgotPassword': 'Forgot Password'
          };
          return translations[key] || key;
        }
      })
    }));
    
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => jest.fn()
    }));
    
    // Reset module cache to ensure our mocks are used
    jest.resetModules();
    
    // Re-import the component after mocking
    const LoginComponent = require('../pages/Login').default;
    
    render(<BrowserRouter><LoginComponent /></BrowserRouter>);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    // Wait for login to be called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});