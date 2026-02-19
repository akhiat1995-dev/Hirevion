import React from 'react';
import { 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  ScaleIn, 
  BlurIn,
  StaggerContainer, 
  StaggerItem,
  FloatingElement,
  PulseOnScroll
} from '../components/ScrollAnimations';

const ScrollAnimationsDemo = () => {
  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <FadeInUp>
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold text-navy-900 mb-4">
            Scroll Animations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Scroll down to see elements animate as they enter the viewport
          </p>
        </div>
      </FadeInUp>

      {/* Fade In Up */}
      <section className="mb-20">
        <FadeInUp>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">1. Fade In Up</h2>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-6">
          <FadeInUp delay={0}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-warm-200">
              <h3 className="font-bold text-lg mb-2">Card 1</h3>
              <p className="text-gray-600">This card fades in from below</p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-warm-200">
              <h3 className="font-bold text-lg mb-2">Card 2</h3>
              <p className="text-gray-600">With 0.1s delay</p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-warm-200">
              <h3 className="font-bold text-lg mb-2">Card 3</h3>
              <p className="text-gray-600">With 0.2s delay</p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Fade In Left & Right */}
      <section className="mb-20">
        <FadeInUp>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">2. Fade In Left & Right</h2>
        </FadeInUp>
        <div className="grid md:grid-cols-2 gap-6">
          <FadeInLeft>
            <div className="bg-navy-800 text-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">From Left</h3>
              <p>This element slides in from the left side</p>
            </div>
          </FadeInLeft>
          <FadeInRight>
            <div className="bg-orange-500 text-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">From Right</h3>
              <p>This element slides in from the right side</p>
            </div>
          </FadeInRight>
        </div>
      </section>

      {/* Scale In */}
      <section className="mb-20">
        <FadeInUp>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">3. Scale In</h2>
        </FadeInUp>
        <div className="flex justify-center">
          <ScaleIn>
            <div className="bg-gradient-to-br from-navy-800 to-navy-900 text-white p-10 rounded-2xl text-center max-w-md">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="font-bold text-2xl mb-2">Scale Animation</h3>
              <p>This element scales up from 0.8 to 1.0 as it enters the viewport</p>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Blur In */}
      <section className="mb-20">
        <FadeInUp>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">4. Blur In</h2>
        </FadeInUp>
        <div className="flex justify-center">
          <BlurIn>
            <div className="bg-warm-100 p-8 rounded-lg border-2 border-dashed border-navy-300">
              <h3 className="font-serif text-2xl font-bold text-navy-900 text-center">
                From Blur to Clear
              </h3>
              <p className="text-center text-gray-600 mt-2">
                This text starts blurry and comes into focus
              </p>
            </div>
          </BlurIn>
        </div>
      </section>

      {/* Stagger Animation */}
      <section className="mb-20">
        <FadeInUp>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">5. Stagger Animation</h2>
          <p className="text-gray-600 mb-6">Items animate one after another with a delay</p>
        </FadeInUp>
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <StaggerItem key={num}>
              <div className="bg-white p-6 rounded-lg shadow-md border border-warm-200 text-center">
                <div className="text-3xl font-bold text-navy-900 mb-2">{num}</div>
                <p className="text-sm text-gray-600">Item {num}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Floating Element */}
      <section className="mb-20">
        <FadeInUp>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">6. Floating Animation</h2>
          <p className="text-gray-600 mb-6">Continuous floating animation</p>
        </FadeInUp>
        <div className="flex justify-center gap-8">
          <FloatingElement amplitude={10} duration={3}>
            <div className="bg-blue-500 text-white p-6 rounded-full w-24 h-24 flex items-center justify-center">
              <span className="text-2xl">☁️</span>
            </div>
          </FloatingElement>
          <FloatingElement amplitude={15} duration={4}>
            <div className="bg-orange-500 text-white p-6 rounded-full w-24 h-24 flex items-center justify-center">
              <span className="text-2xl">🎈</span>
            </div>
          </FloatingElement>
          <FloatingElement amplitude={8} duration={2.5}>
            <div className="bg-green-500 text-white p-6 rounded-full w-24 h-24 flex items-center justify-center">
              <span className="text-2xl">🍃</span>
            </div>
          </FloatingElement>
        </div>
      </section>

      {/* Pulse On Scroll */}
      <section className="mb-20">
        <FadeInUp>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">7. Pulse on Scroll</h2>
        </FadeInUp>
        <div className="flex justify-center gap-6">
          <PulseOnScroll>
            <div className="bg-navy-800 text-white p-8 rounded-xl text-center">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="font-bold text-xl">Feature 1</h3>
            </div>
          </PulseOnScroll>
          <PulseOnScroll>
            <div className="bg-orange-500 text-white p-8 rounded-xl text-center">
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="font-bold text-xl">Feature 2</h3>
            </div>
          </PulseOnScroll>
          <PulseOnScroll>
            <div className="bg-green-600 text-white p-8 rounded-xl text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-bold text-xl">Feature 3</h3>
            </div>
          </PulseOnScroll>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="bg-navy-50 rounded-xl p-8 border border-navy-200">
        <FadeInUp>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">How to Use</h2>
          <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`import { FadeInUp, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';

// Simple fade in
<FadeInUp>
  <YourContent />
</FadeInUp>

// With delay
<FadeInUp delay={0.2}>
  <YourContent />
</FadeInUp>

// Stagger animation for lists
<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card {...item} />
    </StaggerItem>
  ))}
</StaggerContainer>`}
          </pre>
        </FadeInUp>
      </section>
    </div>
  );
};

export default ScrollAnimationsDemo;
