import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
          <div className="text-center max-w-md bg-white rounded-lg border border-red-200 p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="font-serif text-xl font-bold text-red-700 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4 text-sm">An unexpected error occurred. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-navy-800 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
