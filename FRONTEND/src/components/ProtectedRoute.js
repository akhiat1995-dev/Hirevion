import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, Alert } from '../components/ui';

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!loading && !requireAuth && isAuthenticated) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        if (user?.role === 'recruiter') {
          navigate('/recruiter', { replace: true });
        } else {
          navigate('/candidate', { replace: true });
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, requireAuth, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-warm-200 shadow-sm p-8 text-center">
            <Alert
              type="info"
              title="Already Signed In"
              message={`You're currently signed in as a ${user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'}. To create a different account, please sign out first.`}
              className="mb-6"
            />
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (user?.role === 'recruiter') {
                    navigate('/recruiter');
                  } else {
                    navigate('/candidate');
                  }
                }}
                className="w-full bg-navy-900 text-white py-2.5 rounded-lg font-medium hover:bg-navy-800 transition-colors"
              >
                Go to my Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowMessage(false);
                }}
                className="w-full border-2 border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:border-gray-300 transition-colors"
              >
                Sign Out to Create New Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
