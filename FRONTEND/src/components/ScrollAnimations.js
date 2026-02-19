import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Fade In Up - Most common scroll animation
export const FadeInUp = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade In Left
export const FadeInLeft = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -80 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade In Right
export const FadeInRight = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale In
export const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Rotate In
export const RotateIn = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
      animate={isInView ? { opacity: 1, rotate: 0, scale: 1 } : { opacity: 0, rotate: -10, scale: 0.9 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container - For lists/grids
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item - Use inside StaggerContainer
export const StaggerItem = ({ 
  children, 
  className = ''
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax Scroll Effect
export const ParallaxSection = ({ 
  children, 
  speed = 0.5,
  className = ''
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300 * speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};

// Text Reveal Animation
export const TextReveal = ({ 
  children, 
  delay = 0,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Blur In Effect
export const BlurIn = ({ 
  children, 
  delay = 0,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide Up with Skew
export const SlideUpSkew = ({ 
  children, 
  delay = 0,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, skewY: 5 }}
      animate={isInView ? { opacity: 1, y: 0, skewY: 0 } : { opacity: 0, y: 100, skewY: 5 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating Animation (continuous)
export const FloatingElement = ({ 
  children, 
  amplitude = 10,
  duration = 3,
  className = ''
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Pulse Animation on Scroll
export const PulseOnScroll = ({ 
  children, 
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={isInView ? { 
        scale: [0.9, 1.05, 1], 
        opacity: 1 
      } : { 
        scale: 0.9, 
        opacity: 0 
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll Progress Bar
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// Count Up Animation
export const CountUp = ({ 
  end, 
  duration = 2,
  suffix = '',
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className={className}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CountUpNumber end={end} duration={duration} />
          {suffix}
        </motion.span>
      )}
    </motion.span>
  );
};

// Helper component for count up
const CountUpNumber = ({ end, duration }) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <>{count}</>;
};

export default {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScaleIn,
  RotateIn,
  StaggerContainer,
  StaggerItem,
  ParallaxSection,
  TextReveal,
  BlurIn,
  SlideUpSkew,
  FloatingElement,
  PulseOnScroll,
  ScrollProgressBar,
  CountUp
};
