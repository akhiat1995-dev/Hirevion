import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateUpload from './pages/CandidateUpload';
import CandidateResults from './pages/CandidateResults';
import CandidateDashboard from './pages/CandidateDashboard';
import Results from './pages/Results';
import JobSetup from './pages/JobSetup';
import TestBackend from './pages/TestBackend';
import DesignShowcase from './pages/DesignShowcase';
import ScrollAnimationsDemo from './pages/ScrollAnimationsDemo';
import TryFree from './pages/TryFree';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSettings from './pages/ProfileSettings';
import RecruiterLanding from './pages/RecruiterLanding';
import CandidateLanding from './pages/CandidateLanding';
import RecruiterDemo from './pages/RecruiterDemo';
import CandidateDemo from './pages/CandidateDemo';
import NotFound from './pages/NotFound';
import './components/PageTransition.css';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -20, scale: 0.98 }
};

const pageTransition = { type: 'spring', stiffness: 100, damping: 20, mass: 0.5 };

const AnimatedRoute = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="page-transition-wrapper"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
        <Route path="/recruiter-landing" element={<AnimatedRoute><RecruiterLanding /></AnimatedRoute>} />
        <Route path="/recruiter-demo" element={<AnimatedRoute><RecruiterDemo /></AnimatedRoute>} />
        <Route path="/candidate-landing" element={<AnimatedRoute><CandidateLanding /></AnimatedRoute>} />
        <Route path="/candidate-demo" element={<AnimatedRoute><CandidateDemo /></AnimatedRoute>} />
        <Route path="/test" element={<AnimatedRoute><TestBackend /></AnimatedRoute>} />
        <Route path="/designs" element={<AnimatedRoute><DesignShowcase /></AnimatedRoute>} />
        <Route path="/scroll-demo" element={<AnimatedRoute><ScrollAnimationsDemo /></AnimatedRoute>} />
        <Route path="/try-free" element={<AnimatedRoute><TryFree /></AnimatedRoute>} />
        
        <Route path="/login" element={<AnimatedRoute><ProtectedRoute requireAuth={false}><Login /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/signin" element={<AnimatedRoute><ProtectedRoute requireAuth={false}><Login /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/register" element={<AnimatedRoute><ProtectedRoute requireAuth={false}><Register /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/forgot-password" element={<AnimatedRoute><ProtectedRoute requireAuth={false}><ForgotPassword /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/reset-password" element={<AnimatedRoute><ProtectedRoute requireAuth={false}><ResetPassword /></ProtectedRoute></AnimatedRoute>} />
        
        <Route path="/recruiter" element={<AnimatedRoute><ProtectedRoute><RecruiterDashboard /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/candidate" element={<AnimatedRoute><ProtectedRoute><CandidateUpload /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/candidate/dashboard" element={<AnimatedRoute><ProtectedRoute><CandidateDashboard /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/candidate/results" element={<AnimatedRoute><CandidateResults /></AnimatedRoute>} />
        <Route path="/job-setup" element={<AnimatedRoute><ProtectedRoute><JobSetup /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/results" element={<AnimatedRoute><ProtectedRoute><Results /></ProtectedRoute></AnimatedRoute>} />
        <Route path="/profile" element={<AnimatedRoute><ProtectedRoute><ProfileSettings /></ProtectedRoute></AnimatedRoute>} />
        
        <Route path="*" element={<AnimatedRoute><NotFound /></AnimatedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLandingPage = location.pathname === '/recruiter-landing' || location.pathname === '/candidate-landing' || location.pathname === '/try-free';
  
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className={`min-h-screen flex flex-col ${isHome ? 'bg-transparent' : 'bg-warm-white'}`}>
              <CustomCursor />
              {isLandingPage && <Navbar />}
              <main className={`flex-grow relative overflow-x-hidden ${isHome ? 'flex items-center justify-center' : ''}`}>
                <AnimatedRoutes />
              </main>
              {isLandingPage && <Footer />}
            </div>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
