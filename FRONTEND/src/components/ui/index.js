import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800 focus:ring-navy-900',
    secondary: 'bg-white text-navy-900 border border-navy-900 hover:bg-navy-50 focus:ring-navy-900',
    accent: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    ghost: 'text-navy-900 hover:bg-navy-50 focus:ring-navy-900'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string
};

export const Input = ({ 
  label, 
  error, 
  type = 'text', 
  required = false, 
  className = '',
  id,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string
};

export const Textarea = ({ 
  label, 
  error, 
  required = false, 
  rows = 4, 
  className = '',
  id,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent resize-vertical ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string
};

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-warm-200 shadow-sm p-6 ${
        hover ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    accent: 'bg-orange-100 text-orange-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info', 'accent']),
  className: PropTypes.string
};

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg className={`animate-spin text-navy-900 ${sizes[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'ℹ️' },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '✅' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⚠️' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '❌' }
  };

  const style = types[type];

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span>{style.icon}</span>
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${style.text}`}>{title}</h3>}
          {message && <div className={`mt-1 text-sm ${style.text}`}>{message}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${style.bg} ${style.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  className: PropTypes.string
};
