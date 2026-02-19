import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Upload, Users, Brain, BarChart3, CheckCircle, ChevronRight, Pencil, Sparkles, X } from 'lucide-react';
import { PencilUnderline, HandDrawnBox } from '../components/PencilDesigns';
import { FadeInUp, FadeInLeft, FadeInRight, ScaleIn, StaggerContainer, StaggerItem, BlurIn } from '../components/ScrollAnimations';
import '../components/PencilDesigns.css';

const Home = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <div className="paper-texture">
      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setShowRoleModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">Choose Your Role</h2>
              <p className="text-gray-600 text-sm">Select how you want to use Hirevion</p>
            </div>
            
            <div className="space-y-4">
              <Link 
                to="/recruiter"
                onClick={() => setShowRoleModal(false)}
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-warm-200 hover:border-navy-800 hover:bg-navy-50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy-900">Recruiter</h3>
                  <p className="text-sm text-gray-500">I'm hiring and want to find candidates</p>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-navy-800 transition-colors" />
              </Link>
              
              <Link 
                to="/candidate"
                onClick={() => setShowRoleModal(false)}
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-warm-200 hover:border-navy-800 hover:bg-navy-50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy-900">Candidate</h3>
                  <p className="text-sm text-gray-500">I want to analyze and improve my CV</p>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-navy-800 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-warm-white to-warm-100 relative overflow-hidden">
        {/* Decorative Pencil Elements */}
        <div className="absolute top-20 right-10 opacity-10 transform rotate-45">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <rect x="30" y="20" width="40" height="10" fill="#2C5282" rx="2" transform="rotate(45 50 50)"/>
            <polygon points="65,35 75,25 70,45" fill="#F6AD55" transform="rotate(45 50 50)"/>
          </svg>
        </div>
        <div className="absolute bottom-20 left-10 opacity-10 transform -rotate-12">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <rect x="30" y="20" width="40" height="10" fill="#2C5282" rx="2" transform="rotate(-30 50 50)"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              {/* Brand Badge */}
              <FadeInUp delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-warm-200 mb-6 shadow-sm">
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 bg-navy-800 rounded flex items-center justify-center">
                      <Pencil size={12} className="text-white" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-navy-900">Hirevion</span>
                  <span className="text-xs text-orange-500 font-medium tracking-wider uppercase">Smart Hiring</span>
                </div>
              </FadeInUp>
              
              <FadeInUp delay={0.1}>
                <h1 className="font-serif text-5xl lg:text-6xl font-bold text-navy-900 leading-tight mb-6">
                  Find the <PencilUnderline color="#F6AD55">Perfect Profil</PencilUnderline> with AI
                </h1>
              </FadeInUp>
              
              <FadeInUp delay={0.2}>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                  Hirevion connects exceptional profil with forward-thinking companies. 
                  Our AI analyzes skills, experience, and potential to find your perfect match.
                </p>
              </FadeInUp>
              
              <FadeInUp delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setShowRoleModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-navy-800 text-white px-8 py-4 rounded-sm hover:bg-navy-900 transition-all shadow-lg hover:shadow-xl font-medium sketch-button-hover"
                  >
                    <Rocket size={20} />
                    Get Started
                  </button>
                  
                  <Link 
                    to="/candidate" 
                    className="inline-flex items-center justify-center gap-2 bg-white text-navy-800 border-2 border-warm-200 px-8 py-4 rounded-sm hover:border-navy-800 transition-all font-medium sketch-button-hover"
                  >
                    <Upload size={20} />
                    Analyze My CV
                  </Link>
                </div>
              </FadeInUp>

              {/* Stats */}
              <FadeInUp delay={0.4}>
                <div className="flex gap-8 mt-12 pt-8 border-t border-warm-200">
                  <div>
                    <div className="text-3xl font-serif font-bold text-navy-900">95%</div>
                    <div className="text-sm text-gray-500">Match Accuracy</div>
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-navy-900">10x</div>
                    <div className="text-sm text-gray-500">Faster Hiring</div>
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-navy-900">500+</div>
                    <div className="text-sm text-gray-500">Companies Trust Us</div>
                  </div>
                </div>
              </FadeInUp>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="animate-float">
                {/* Main Card */}
                <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
                  {/* Header with Logo */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-warm-100">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 bg-navy-800 rounded flex items-center justify-center">
                        <Pencil size={12} className="text-white" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full border border-white"></div>
                    </div>
                    <span className="font-serif font-bold text-navy-900">Hirevion</span>
                    <span className="text-xs text-green-600 font-medium ml-auto flex items-center gap-1">
                      <Sparkles size={12} /> AI Powered
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center font-bold">SA</div>
                      <div>
                        <div className="font-bold text-navy-900">Mr Said Azzouzi</div>
                        <div className="text-xs text-gray-500">Senior Developer</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-serif font-bold text-green-600">94%</div>
                      <div className="text-xs text-gray-500">Match</div>
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Python</span>
                      <span className="font-bold text-navy-900">95%</span>
                    </div>
                    <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy-800 w-[95%]"></div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">React</span>
                      <span className="font-bold text-navy-900">88%</span>
                    </div>
                    <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy-800 w-[88%]"></div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Leadership</span>
                      <span className="font-bold text-navy-900">92%</span>
                    </div>
                    <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy-800 w-[92%]"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">Approved</span>
                    <span className="px-2 py-1 bg-warm-100 text-gray-600 text-xs rounded">8 Years Exp</span>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg paper-shadow px-4 py-2 border border-warm-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm font-bold text-navy-900">AI Verified</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-navy-800 text-white rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Brain size={16} />
                    <span className="text-sm font-bold">5 Candidates Matched</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-navy-800/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-800/5 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-navy-900 mb-4">
                Why Choose <PencilUnderline>Hirevion</PencilUnderline>?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Revolutionary AI technology for modern recruitment</p>
            </div>
          </FadeInUp>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <HandDrawnBox>
                <FeatureCard 
                  icon={<Brain size={28} />}
                  title="AI-Powered Matching"
                  description="Advanced algorithms analyze skills, experience, and potential. Smart skill similarity detection recognizes related technologies."
                />
              </HandDrawnBox>
            </StaggerItem>
            <StaggerItem>
              <HandDrawnBox>
                <FeatureCard 
                  icon={<BarChart3 size={28} />}
                  title="Detailed Analytics"
                  description="Get comprehensive scoring breakdowns: skills (40%), experience (25%), education (15%), domain fit (20%)."
                />
              </HandDrawnBox>
            </StaggerItem>
            <StaggerItem>
              <HandDrawnBox>
                <FeatureCard 
                  icon={<Users size={28} />}
                  title="Flexible Selection"
                  description="4-tier system: Excellent (80-100%), Good (65-79%), Potential (50-64%). Find candidates with potential, not just perfect matches."
                />
              </HandDrawnBox>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-navy-900 mb-4">How Hirevion Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Simple 3-step process to find your ideal candidates</p>
            </div>
          </FadeInUp>

          <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <StepCard 
                number="1"
                title="Upload CVs"
                description="Upload multiple PDF CVs. Our AI extracts structured data including skills, experience, education, and projects."
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard 
                number="2"
                title="Define Job"
                description="Enter job title, number of positions, and requirements. AI structures the profile and identifies key skills needed."
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard 
                number="3"
                title="Get Results"
                description="Receive ranked candidates with detailed scoring, skill analysis, strengths/weaknesses, and hiring recommendations."
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <FadeInUp>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Pencil size={16} />
              <span className="text-sm font-medium">Join 500+ Companies</span>
            </div>
            
            <h2 className="font-serif text-4xl font-bold mb-6">Ready to Transform Your Hiring?</h2>
            <p className="text-navy-200 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of companies who have streamlined their hiring process with Hirevion's AI-powered platform.
            </p>
          </div>
          <FadeInUp delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowRoleModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-white text-navy-900 px-8 py-4 rounded-sm hover:bg-warm-50 transition-all font-bold"
            >
              <Rocket size={20} />
              Start Free Today
            </button>
            <Link 
              to="/candidate" 
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-sm hover:bg-white/10 transition-all"
            >
              <Upload size={20} />
              Upload Your CV
            </Link>
          </div>
          </FadeInUp>
        </FadeInUp>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-warm-50 rounded-lg p-8 border border-warm-200 hover:border-navy-800 transition-all group">
    <div className="w-14 h-14 bg-navy-800 rounded-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

// Step Card Component
const StepCard = ({ number, title, description }) => (
  <div className="relative">
    <div className="bg-white rounded-lg p-8 paper-shadow border border-warm-200 h-full">
      <div className="w-12 h-12 bg-navy-800 text-white rounded-full flex items-center justify-center font-serif font-bold text-xl mb-6">
        {number}
      </div>
      <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
    {number !== "3" && (
      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
        <ChevronRight size={32} className="text-warm-200" />
      </div>
    )}
  </div>
);

export default Home;
