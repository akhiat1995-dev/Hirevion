import React, { useState } from 'react';
import { 
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
} from '../components/PencilDesigns';
import '../components/PencilDesigns.css';

const DesignShowcase = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl font-bold text-navy-900 mb-4">
          Pencil Design System
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Creative pencil-themed UI components that bring the Hirevion brand to life
        </p>
      </div>

      {/* Writing Animation */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">✏️ Writing Animations</h2>
        <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200">
          <div className="mb-6">
            <PencilWriteText text="Welcome to Hirevion" className="text-3xl font-bold" />
          </div>
          <div className="text-lg">
            AI-powered recruitment with <PencilUnderline color="#F6AD55">human touch</PencilUnderline>
          </div>
        </div>
      </section>

      {/* Progress Bars */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">📊 Pencil Progress</h2>
        <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200 space-y-6">
          <PencilProgressBar progress={75} label="CV Analysis Complete" />
          <PencilProgressBar progress={45} label="Skills Matching" />
          <PencilProgressBar progress={90} label="Experience Check" />
        </div>
      </section>

      {/* Hand Drawn Elements */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">🎨 Hand-Drawn Style</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <HandDrawnBox>
            <h3 className="font-bold text-navy-900 text-xl mb-3">Sketchy Container</h3>
            <p className="text-gray-600">
              This box has a hand-drawn border that animates on load. 
              Perfect for feature highlights or important callouts.
            </p>
          </HandDrawnBox>

          <StickyNote color="#FEFCBF">
            <h3 className="font-bold text-yellow-800 mb-2">Quick Tip!</h3>
            <p className="text-yellow-700 text-sm">
              Upload PDFs for best results. Our AI can extract structured data from most CV formats.
            </p>
          </StickyNote>
        </div>
      </section>

      {/* Interactive Elements */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">✨ Interactive Elements</h2>
        <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200">
          <div className="space-y-6">
            {/* Checkbox */}
            <div>
              <h3 className="font-bold text-navy-900 mb-4">Pencil Checkbox</h3>
              <PencilCheckbox 
                checked={checked} 
                onChange={() => setChecked(!checked)}
                label="I agree to the terms and conditions"
              />
            </div>

            <PencilDivider text="OR" />

            {/* Sketch Buttons */}
            <div>
              <h3 className="font-bold text-navy-900 mb-4">Sketch Buttons</h3>
              <div className="flex gap-4 flex-wrap">
                <SketchButton onClick={() => {}} variant="primary">
                  <span className="bg-navy-800 text-white px-4 py-2 rounded-sm">
                    Analyze CV
                  </span>
                </SketchButton>
                
                <SketchButton onClick={() => {}} variant="secondary">
                  Learn More
                </SketchButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighter Effects */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">🖍️ Highlighter Effects</h2>
        <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200">
          <p className="text-lg leading-relaxed text-gray-700">
            Our AI identifies <Highlighter>key skills</Highlighter> and 
            <Highlighter color="#9AE6B4">experience</Highlighter> that match your job requirements. 
            We also flag <Highlighter color="#FBB6CE">potential gaps</Highlighter> for you to review.
          </p>
        </div>
      </section>

      {/* Loading Animation */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">⏳ Loading States</h2>
        <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200">
          <div className="flex justify-center">
            {loading ? (
              <PencilLoading text="Analyzing your CV with AI..." />
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Click to see the loading animation</p>
                <button 
                  onClick={handleAnalyze}
                  className="px-6 py-3 bg-navy-800 text-white rounded-sm hover:bg-navy-900"
                >
                  Analyze CV
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">📖 How to Use</h2>
        <div className="bg-navy-50 rounded-lg p-8 border border-navy-200">
          <pre className="text-sm text-navy-800 overflow-x-auto">
{`import { 
  PencilProgressBar, 
  PencilUnderline,
  HandDrawnBox,
  SketchButton 
} from '../components/PencilDesigns';

// Progress bar with pencil tip
<PencilProgressBar progress={75} label="Complete" />

// Animated underline
<PencilUnderline>Important Text</PencilUnderline>

// Hand-drawn container
<HandDrawnBox>
  <h3>Your Content Here</h3>
</HandDrawnBox>

// Sketch-style button
<SketchButton onClick={handleClick}>
  Click Me
</SketchButton>`}
          </pre>
        </div>
      </section>

      {/* Design Principles */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">🎯 Design Principles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg paper-shadow border border-warm-200">
            <div className="text-3xl mb-3">✏️</div>
            <h3 className="font-bold text-navy-900 mb-2">Hand-Crafted Feel</h3>
            <p className="text-gray-600 text-sm">
              Slight imperfections and organic shapes create a human, approachable feel
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg paper-shadow border border-warm-200">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold text-navy-900 mb-2">Creative Expression</h3>
            <p className="text-gray-600 text-sm">
              Pencil metaphor represents creation, editing, and writing the future
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg paper-shadow border border-warm-200">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-navy-900 mb-2">Dynamic Energy</h3>
            <p className="text-gray-600 text-sm">
              Animations and interactive elements bring the brand to life
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignShowcase;
