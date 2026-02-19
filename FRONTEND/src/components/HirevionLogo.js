import React from 'react';

// Hirevion Logo React Component
// Usage: <HirevionLogo size="200" showTagline={true} variant="default" />

const HirevionLogo = ({ 
  size = 200, 
  showTagline = true, 
  variant = 'default',
  className = '' 
}) => {
  const height = size * 0.3; // 60/200 ratio
  
  const variants = {
    default: {
      textGradient: ['#1A365D', '#2C5282', '#3182CE'],
      pencilBody: '#2C5282',
      pencilWood: '#F6AD55',
      pencilTip: '#1A202C',
      accent: '#63B3ED',
      tagline: '#718096',
      stroke: '#F6AD55'
    },
    dark: {
      textGradient: ['#63B3ED', '#4299E1', '#3182CE'],
      pencilBody: '#63B3ED',
      pencilWood: '#F6AD55',
      pencilTip: '#FFFFFF',
      accent: '#90CDF4',
      tagline: '#A0AEC0',
      stroke: '#F6AD55'
    },
    light: {
      textGradient: ['#FFFFFF', '#E2E8F0', '#CBD5E0'],
      pencilBody: '#FFFFFF',
      pencilWood: '#F6AD55',
      pencilTip: '#FFFFFF',
      accent: '#90CDF4',
      tagline: '#E2E8F0',
      stroke: '#F6AD55'
    }
  };
  
  const colors = variants[variant] || variants.default;
  
  return (
    <svg 
      width={size} 
      height={height} 
      viewBox="0 0 200 60" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`hirevionGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.textGradient[0]} />
          <stop offset="50%" stopColor={colors.textGradient[1]} />
          <stop offset="100%" stopColor={colors.textGradient[2]} />
        </linearGradient>
      </defs>
      
      {/* Pencil Icon */}
      <g transform="translate(10, 10)">
        <rect x="0" y="5" width="30" height="10" fill={colors.pencilBody} rx="2"/>
        <polygon points="30,5 38,10 30,15" fill={colors.pencilWood}/>
        <polygon points="38,10 42,10 38,8 38,12" fill={colors.pencilTip}/>
        <rect x="5" y="8" width="20" height="4" fill={colors.accent} opacity="0.6" rx="1"/>
      </g>
      
      {/* Brand Name */}
      <text 
        x="55" 
        y="38" 
        fontFamily="'Playfair Display', serif" 
        fontSize="32" 
        fontWeight="700" 
        fill={`url(#hirevionGradient-${variant})`} 
        letterSpacing="-0.5"
      >
        Hirevion
      </text>
      
      {/* Tagline */}
      {showTagline && (
        <text 
          x="55" 
          y="52" 
          fontFamily="'DM Sans', sans-serif" 
          fontSize="10" 
          fontWeight="500" 
          fill={colors.tagline} 
          letterSpacing="1.5"
        >
          AI-POWERED HIRING
        </text>
      )}
      
      {/* Pencil Stroke */}
      <path 
        d="M 55 42 Q 100 45, 180 42" 
        stroke={colors.stroke} 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        opacity="0.8"
      />
    </svg>
  );
};

export default HirevionLogo;
