import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

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

// Page transition settings
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Alternative smooth transition
const smoothTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.5,
};

// Slide transition
const slideVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -100,
  }
};

// Fade up transition
const fadeUpVariants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -40,
  }
};

// Scale fade transition
const scaleFadeVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    scale: 1.1,
    y: -20,
  }
};

// Main Page Transition Component
export const PageTransition = ({ children, variant = 'default' }) => {
  const location = useLocation();
  
  const getVariants = () => {
    switch(variant) {
      case 'slide':
        return slideVariants;
      case 'fadeUp':
        return fadeUpVariants;
      case 'scale':
        return scaleFadeVariants;
      case 'smooth':
        return pageVariants;
      default:
        return pageVariants;
    }
  };
  
  const getTransition = () => {
    switch(variant) {
      case 'smooth':
        return smoothTransition;
      case 'slide':
        return { ...pageTransition, duration: 0.4 };
      default:
        return pageTransition;
    }
  };

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={getVariants()}
      transition={getTransition()}
      className="page-transition-wrapper"
    >
      {children}
    </motion.div>
  );
};

// Animated Routes Wrapper
export const AnimatedRoutes = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          mass: 0.5,
        }}
        className="animated-route"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Scroll-triggered fade in
export const FadeInOnScroll = ({ children, delay = 0, direction = 'up' }) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0 
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for multiple children
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger item (use inside StaggerContainer)
export const StaggerItem = ({ children }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Hover scale effect
export const HoverScale = ({ children, scale = 1.05 }) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic button effect
export const MagneticButton = ({ children }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      whileDrag={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="magnetic-btn"
    >
      {children}
    </motion.button>
  );
};

// Page loader animation
export const PageLoader = () => {
  return (
    <motion.div
      className="page-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="loader-content"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="loader-pencil">✏️</div>
      </motion.div>
    </motion.div>
  );
};

export default PageTransition;
