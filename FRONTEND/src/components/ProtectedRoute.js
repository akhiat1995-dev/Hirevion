import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, Alert } from '../components/ui';

const roleRoutes = {
  recruiter: ['/recruiter', '/job-setup', '/results'],
  user: ['/candidate'],
  candidate: ['/candidate', '/candidate/dashboard', '/candidate/results']
};

const getUserRole = (role) => {
  if (role === 'recruiter') return 'recruiter';
  return 'candidate';
};

const isRouteAllowed = (userRole, pathname) => {
  const allowedRoutes = roleRoutes[userRole] || [];
  return allowedRoutes.some(route => pathname.startsWith(route));
};

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const userRole = getUserRole(user ? user.role : null);

  useEffect(() => {
    if (!loading) {
      const pathname = location.pathname;

      if (requireAuth) {
        if (!isAuthenticated) {
          return;
        }
        if (!isRouteAllowed(userRole, pathname)) {
          setShowMessage(true);
          return;
        }
      } else {
        if (isAuthenticated) {
          setShowMessage(true);
          const timer = setTimeout(() => {
            if (user && user.role === 'recruiter') {
              navigate('/recruiter', { replace: true });
            } else {
              navigate('/candidate', { replace: true });
            }
          }, 3000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [loading, isAuthenticated, requireAuth, user, userRole, navigate, location]);

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

  if (showMessage && requireAuth && isAuthenticated && !isRouteAllowed(userRole, location.pathname)) {
    const targetPath = userRole === 'recruiter' ? '/recruiter' : '/candidate';
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-warm-200 shadow-sm p-8 text-center">
            <Alert
              type="warning"
              title="Access Denied"
              message={`This is the ${userRole === 'recruiter' ? 'Candidate' : 'Recruiter'} platform. You are signed in as a ${userRole === 'recruiter' ? 'Recruiter' : 'Candidate'}.`}
              className="mb-6"
            />
            <button
              onClick={() => navigate(targetPath, { replace: true })}
              className="w-full bg-navy-900 text-white py-2.5 rounded-lg font-medium hover:bg-navy-800 transition-colors"
            >
              Go to My Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!requireAuth && isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-warm-200 shadow-sm p-8 text-center">
            <Alert
              type="info"
              title="Already Signed In"
              message={`You're currently signed in as a ${user && user.role === 'recruiter' ? 'Recruiter' : 'Candidate'}. To create a different account, please sign out first.`}
              className="mb-6"
            />
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (user && user.role === 'recruiter') {
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