import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateUpload from './pages/CandidateUpload';
import CandidateResults from './pages/CandidateResults';
import Results from './pages/Results';
import JobSetup from './pages/JobSetup';
import TestBackend from './pages/TestBackend';
import DesignShowcase from './pages/DesignShowcase';
import ScrollAnimationsDemo from './pages/ScrollAnimationsDemo';
import './components/PageTransition.css';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  }
};

const pageTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.5,
};

// Animated route wrapper
const AnimatedRoute = ({ children }) => {
  return (
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
};

// Routes component with animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <AnimatedRoute>
              <Home />
            </AnimatedRoute>
          } 
        />
        <Route 
          path="/recruiter" 
          element={
            <AnimatedRoute>
              <RecruiterDashboard />
            </AnimatedRoute>
          } 
        />
        <Route 
          path="/candidate" 
          element={
            <AnimatedRoute>
              <CandidateUpload />
            </AnimatedRoute>
          } 
        />
        <Route 
          path="/candidate/results" 
          element={
            <AnimatedRoute>
              <CandidateResults />
            </AnimatedRoute>
          } 
        />
        <Route 
          path="/job-setup" 
          element={
            <AnimatedRoute>
              <JobSetup />
            </AnimatedRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <AnimatedRoute>
              <Results />
            </AnimatedRoute>
          } 
        />
        <Route 
          path="/test" 
          element={
            <AnimatedRoute>
              <TestBackend />
            </AnimatedRoute>
          } 
        />
        <Route 
          path="/designs" 
          element={
            <AnimatedRoute>
              <DesignShowcase />
            </AnimatedRoute>
          } 
        />
        <Route 
          path="/scroll-demo" 
          element={
            <AnimatedRoute>
              <ScrollAnimationsDemo />
            </AnimatedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-warm-white flex flex-col">
      <CustomCursor />
      <Navbar />
      <main className="flex-grow relative overflow-x-hidden">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
