import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Upload, Users, Brain, BarChart3, CheckCircle, ChevronRight, Pencil, Sparkles, Eye, Play } from 'lucide-react';
import { PencilUnderline, HandDrawnBox, PencilButton } from '../components/PencilDesigns';
import { FadeInUp, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { useLanguage } from '../context/LanguageContext';
import '../components/PencilDesigns.css';

const RecruiterLanding = () => {
  const { t } = useLanguage();
  return (
    <div className="paper-texture">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-warm-white to-warm-100 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 opacity-10 transform rotate-45">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <rect x="30" y="20" width="40" height="10" fill="#2C5282" rx="2" transform="rotate(45 50 50)"/>
            <polygon points="65,35 75,25 70,45" fill="#F6AD55" transform="rotate(45 50 50)"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <FadeInUp delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-warm-200 mb-6 shadow-sm">
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 bg-navy-800 rounded flex items-center justify-center">
                      <Pencil size={12} className="text-white" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-navy-900">Hirevion</span>
                  <span className="text-xs text-orange-500 font-medium tracking-wider uppercase">For Recruiters</span>
                </div>
              </FadeInUp>
              
              <FadeInUp delay={0.1}>
                <h1 className="font-serif text-5xl lg:text-6xl font-bold text-navy-900 leading-tight mb-6">
                  {t('findCandidates')}
                </h1>
              </FadeInUp>
              
              <FadeInUp delay={0.2}>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                  {t('findCandidatesDesc')}
                </p>
              </FadeInUp>
              
              <FadeInUp delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/signin?role=recruiter"
                    className="inline-flex items-center justify-center gap-2 bg-navy-800 text-white px-8 py-4 rounded-sm hover:bg-navy-900 transition-all shadow-lg hover:shadow-xl font-medium"
                  >
                    <Rocket size={20} />
                    {t('getStartedFree')}
                  </Link>
                  
<Link 
                    to="/recruiter-demo"
                    className="inline-flex items-center justify-center gap-2 bg-white text-navy-800 border-2 border-warm-200 px-8 py-4 rounded-sm hover:border-navy-800 transition-all font-medium"
                  >
                    <Eye size={20} />
                    {t('viewDemo')}
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
                    <div className="text-sm text-gray-500">Faster Screening</div>
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-navy-900">500+</div>
                    <div className="text-sm text-gray-500">Companies</div>
                  </div>
                </div>
              </FadeInUp>
            </div>
            
            {/* Right Content - Dashboard Preview */}
            <div className="relative animate-fade-in">
              <FadeInUp delay={0.2}>
                <div className="bg-white rounded-lg shadow-2xl border border-warm-200 overflow-hidden">
                  <div className="bg-navy-900 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-white text-sm font-medium">Hirevion - Recruiter Dashboard</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-navy-900">24</div>
                        <div className="text-xs text-gray-500">Candidates</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">8</div>
                        <div className="text-xs text-gray-500">Shortlisted</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-700">3</div>
                        <div className="text-xs text-gray-500">Interviews</div>
                      </div>
                    </div>
                    <div className="border border-warm-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-navy-900 mb-2">Top Candidates</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm font-medium">Sarah Chen</span>
                          <span className="text-sm font-bold text-green-700">92%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm font-medium">Michael Park</span>
                          <span className="text-sm font-bold text-green-700">87%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm font-medium">Emma Wilson</span>
                          <span className="text-sm font-bold text-blue-700">78%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="font-serif text-3xl font-bold text-navy-900 text-center mb-12">
              {t('powerfulFeatures')}
            </h2>
          </FadeInUp>
          
          <StaggerContainer>
            <StaggerItem>
              <div className="bg-warm-50 p-8 rounded-xl border border-warm-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">AI-Powered CV Screening</h3>
                <p className="text-gray-600">Upload multiple CVs at once. Our AI analyzes and scores candidates against your job requirements automatically.</p>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="bg-warm-50 p-8 rounded-xl border border-warm-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Smart Matching</h3>
                <p className="text-gray-600">Advanced algorithms match candidates to roles based on skills, experience, and cultural fit.</p>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="bg-warm-50 p-8 rounded-xl border border-warm-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">Get comprehensive reports with candidate strengths, weaknesses, and interview recommendations.</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="font-serif text-3xl font-bold text-navy-900 text-center mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Get started in minutes with our simple 3-step process
            </p>
          </FadeInUp>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeInUp delay={0.1}>
              <div className="text-center">
                <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">Post a Job</h3>
                <p className="text-gray-600">Enter job title, requirements, and number of positions</p>
              </div>
            </FadeInUp>
            
            <FadeInUp delay={0.2}>
              <div className="text-center">
                <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">Upload CVs</h3>
                <p className="text-gray-600">Drag & drop PDF CVs of candidates</p>
              </div>
            </FadeInUp>
            
            <FadeInUp delay={0.3}>
              <div className="text-center">
                <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">Get Results</h3>
                <p className="text-gray-600">Receive ranked candidates with scores</p>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="font-serif text-3xl font-bold text-white mb-4">
              Ready to Find Your Best Candidates?
            </h2>
            <p className="text-gray-300 mb-8">
              Join hundreds of recruiters already using Hirevion to hire smarter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signin?role=recruiter"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-sm hover:bg-orange-600 transition-all font-medium"
              >
                <Rocket size={20} />
                Get Started Free
              </Link>
              <Link 
                to="/recruiter-demo"
                className="inline-flex items-center justify-center gap-2 bg-white text-navy-800 px-8 py-4 rounded-sm hover:bg-gray-100 transition-all font-medium"
              >
                <Eye size={20} />
                View Demo
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
};

export default RecruiterLanding;