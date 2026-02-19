import React from 'react';
import './PencilDesigns.css';

// Pencil Writing Animation Component
export const PencilWriteText = ({ text, className = '' }) => {
  return (
    <div className={`pencil-write-container ${className}`}>
      <span className="pencil-write-text">{text}</span>
      <svg className="pencil-cursor" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#F6AD55"/>
      </svg>
    </div>
  );
};

// Pencil Progress Bar
export const PencilProgressBar = ({ progress, label }) => {
  return (
    <div className="pencil-progress-container">
      <div className="pencil-progress-track">
        <div 
          className="pencil-progress-fill" 
          style={{ width: `${progress}%` }}
        >
          <div className="pencil-progress-tip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#F6AD55"/>
            </svg>
          </div>
        </div>
      </div>
      <span className="pencil-progress-label">{label}</span>
    </div>
  );
};

// Pencil Underline Effect
export const PencilUnderline = ({ children, color = '#F6AD55' }) => {
  return (
    <span className="pencil-underline-wrapper">
      {children}
      <svg className="pencil-underline" viewBox="0 0 200 12" preserveAspectRatio="none">
        <path 
          d="M0 6 Q 50 2, 100 6 T 200 6" 
          stroke={color} 
          strokeWidth="3" 
          fill="none"
          className="underline-path"
        />
      </svg>
    </span>
  );
};

// Hand Drawn Box
export const HandDrawnBox = ({ children, className = '' }) => {
  return (
    <div className={`hand-drawn-box ${className}`}>
      <svg className="hand-drawn-border" viewBox="0 0 400 200" preserveAspectRatio="none">
        <path 
          d="M10 10 Q 200 5, 390 10 Q 395 100, 390 190 Q 200 195, 10 190 Q 5 100, 10 10" 
          stroke="#2C5282" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
          className="drawn-path"
        />
      </svg>
      <div className="hand-drawn-content">
        {children}
      </div>
    </div>
  );
};

// Pencil Checkbox
export const PencilCheckbox = ({ checked, onChange, label }) => {
  return (
    <label className="pencil-checkbox-label">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        className="pencil-checkbox-input"
      />
      <span className="pencil-checkbox-custom">
        <svg className="pencil-checkmark" viewBox="0 0 24 24" fill="none">
          <path 
            d="M5 12l5 5L20 7" 
            stroke={checked ? "#10B981" : "transparent"} 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={checked ? "check-animate" : ""}
          />
        </svg>
      </span>
      <span className="pencil-checkbox-text">{label}</span>
    </label>
  );
};

// Sketch Button
export const SketchButton = ({ children, onClick, variant = 'primary' }) => {
  const variantClass = variant === 'primary' ? 'sketch-primary' : 'sketch-secondary';
  
  return (
    <button className={`sketch-button ${variantClass}`} onClick={onClick}>
      <svg className="sketch-border" viewBox="0 0 200 60" preserveAspectRatio="none">
        <path 
          d="M10 10 Q 100 5, 190 10 Q 195 30, 190 50 Q 100 55, 10 50 Q 5 30, 10 10" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
          className="sketch-path"
        />
      </svg>
      <span className="sketch-button-text">{children}</span>
    </button>
  );
};

// Pencil Doodle Divider
export const PencilDivider = ({ text }) => {
  return (
    <div className="pencil-divider">
      <svg className="divider-line left" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0 5 Q 25 2, 50 5 T 100 5" stroke="#E6E2D8" strokeWidth="2" fill="none"/>
      </svg>
      <span className="divider-text">{text}</span>
      <svg className="divider-line right" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0 5 Q 25 8, 50 5 T 100 5" stroke="#E6E2D8" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );
};

// Highlighter Effect
export const Highlighter = ({ children, color = '#F6E05E' }) => {
  return (
    <span className="highlighter-wrapper">
      <span className="highlighter-bg" style={{ backgroundColor: color }}></span>
      <span className="highlighter-text">{children}</span>
    </span>
  );
};

// Sticky Note Card
export const StickyNote = ({ children, color = '#FEFCBF' }) => {
  return (
    <div className="sticky-note" style={{ backgroundColor: color }}>
      <div className="sticky-note-tape"></div>
      <div className="sticky-note-content">
        {children}
      </div>
    </div>
  );
};

// Pencil Loading Animation
export const PencilLoading = ({ text = "Analyzing..." }) => {
  return (
    <div className="pencil-loading">
      <div className="pencil-animation">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <g className="writing-pencil">
            <rect x="20" y="10" width="8" height="30" fill="#2C5282" rx="1"/>
            <polygon points="20,40 28,40 24,48" fill="#F6AD55"/>
            <circle cx="48" cy="24" r="4" fill="#F6AD55" className="pencil-dot"/>
          </g>
        </svg>
      </div>
      <p className="loading-text">{text}</p>
      <div className="writing-line"></div>
    </div>
  );
};

const PencilDesigns = {
  PencilWriteText,
  PencilProgressBar,
  PencilUnderline,
  HandDrawnBox,
  PencilCheckbox,
  SketchButton,
  PencilDivider,
  Highlighter,
  StickyNote,
  PencilLoading
};

export default PencilDesigns;
