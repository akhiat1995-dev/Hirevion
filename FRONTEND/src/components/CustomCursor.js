import React, { useState, useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Detect hoverable elements
    const handleElementHover = (e) => {
      const target = e.target;
      const isHoverable = target.tagName === 'A' || 
                         target.tagName === 'BUTTON' || 
                         target.closest('a') || 
                         target.closest('button') ||
                         target.classList.contains('hoverable');
      setIsHovering(isHoverable);
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor - Pencil */}
      <div
        className={`custom-cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''} ${isVisible ? 'visible' : ''}`}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-svg"
        >
          {/* Pencil body */}
          <rect 
            x="6" 
            y="4" 
            width="12" 
            height="20" 
            rx="2" 
            fill="#2C5282"
            transform="rotate(-45 12 14)"
          />
          {/* Wood part */}
          <polygon 
            points="20,16 26,10 26,22" 
            fill="#F6AD55"
            transform="translate(-2, 2)"
          />
          {/* Lead tip */}
          <polygon 
            points="26,10 29,7 29,13" 
            fill="#1A202C"
            transform="translate(-2, 2)"
          />
          {/* Highlight */}
          <rect 
            x="8" 
            y="8" 
            width="6" 
            height="12" 
            rx="1" 
            fill="#63B3ED" 
            opacity="0.6"
            transform="rotate(-45 11 14)"
          />
        </svg>
      </div>

      {/* Trail effect */}
      <CursorTrail position={position} />
    </>
  );
};

// Cursor trail component
const CursorTrail = ({ position }) => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    setTrail(prev => {
      const newTrail = [...prev, position].slice(-5); // Keep last 5 positions
      return newTrail;
    });
  }, [position]);

  return (
    <div className="cursor-trail">
      {trail.map((pos, index) => (
        <div
          key={index}
          className="trail-dot"
          style={{
            left: pos.x,
            top: pos.y,
            opacity: (index + 1) / trail.length * 0.3,
            transform: `scale(${(index + 1) / trail.length})`,
          }}
        />
      ))}
    </div>
  );
};

export default CustomCursor;
