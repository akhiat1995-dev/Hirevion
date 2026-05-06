import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Upload, FileText, TrendingUp, CheckCircle, ChevronRight, Pencil, Sparkles, Star } from 'lucide-react';
import { PencilUnderline, HandDrawnBox } from '../components/PencilDesigns';
import { FadeInUp, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { useLanguage } from '../context/LanguageContext';
import '../components/PencilDesigns.css';

const CandidateLanding = () => {
  const { t } = useLanguage();
  return (
    <div className="paper-texture">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-warm-50 to-warm-100 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 opacity-10 transform rotate-45">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <rect x="30" y="20" width="40" height="10" fill="#F97316" rx="2" transform="rotate(45 50 50)"/>
            <polygon points="65,35 75,25 70,45" fill="#FCD34D" transform="rotate(45 50 50)"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <FadeInUp delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-200 mb-6 shadow-sm">
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 bg-orange-500 rounded flex items-center justify-center">
                      <Pencil size={12} className="text-white" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-navy-900">Hirevion</span>
                  <span className="text-xs text-orange-500 font-medium tracking-wider uppercase">For Talents</span>
                </div>
              </FadeInUp>
              
              <FadeInUp delay={0.1}>
                <h1 className="font-serif text-5xl lg:text-6xl font-bold text-navy-900 leading-tight mb-6">
                  {t('improveCV')}
                </h1>
              </FadeInUp>
              
              <FadeInUp delay={0.2}>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                  {t('improveCVDesc')}
                </p>
              </FadeInUp>
              
              <FadeInUp delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/signin?role=candidate"
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-sm hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl font-medium"
                  >
                    <Upload size={20} />
                    {t('analyzeMyCV')}
                  </Link>
                  
                  <Link 
                    to="/signin?role=candidate"
                    className="inline-flex items-center justify-center gap-2 bg-white text-navy-800 border-2 border-warm-200 px-8 py-4 rounded-sm hover:border-orange-500 transition-all font-medium"
                  >
                    <FileText size={20} />
                    {t('viewDemo')}
                  </Link>
                </div>
              </FadeInUp>

              {/* Stats */}
              <FadeInUp delay={0.4}>
                <div className="flex gap-8 mt-12 pt-8 border-t border-warm-200">
                  <div>
                    <div className="text-3xl font-serif font-bold text-orange-600">94%</div>
                    <div className="text-sm text-gray-500">{t('matchRate')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-orange-600">50+</div>
                    <div className="text-sm text-gray-500">{t('skillsDetected')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-orange-600">1000+</div>
                    <div className="text-sm text-gray-500">{t('cvsAnalyzed')}</div>
                  </div>
                </div>
              </FadeInUp>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="animate-float">
                <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-warm-100">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 bg-orange-500 rounded flex items-center justify-center">
                        <Pencil size={12} className="text-white" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full border border-white"></div>
                    </div>
                    <span className="font-serif font-bold text-navy-900">Hirevion</span>
                    <span className="text-xs text-green-600 font-medium ml-auto flex items-center gap-1">
                      <Sparkles size={12} /> CV Analyzer
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">YO</div>
                      <div>
                        <div className="font-bold text-navy-900">Your CV Score</div>
                        <div className="text-xs text-gray-500">Based on industry standards</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-serif font-bold text-orange-500">85%</div>
                      <div className="text-xs text-gray-500">Good</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Skills Section</span>
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Strong
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Good
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Education</span>
                      <span className="font-bold text-orange-500 flex items-center gap-1">
                        <ChevronRight size={14} /> Needs Work
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-700 mb-2">
                      <Star size={14} />
                      AI Suggestions
                    </div>
                    <p className="text-xs text-gray-600">
                      Add a summary section to highlight your key achievements
                    </p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    <span className="text-sm font-bold">95% Better</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg paper-shadow px-4 py-2 border border-warm-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm font-bold text-navy-900">ATS Friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-navy-900 mb-4">
                {t('whyTalentsLove')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t('improveChances')}</p>
            </div>
          </FadeInUp>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <HandDrawnBox>
                <FeatureCard 
                  icon={<FileText size={28} />}
                  title={t('instantAnalysis')}
                  description={t('instantAnalysisDesc')}
                />
              </HandDrawnBox>
            </StaggerItem>
            <StaggerItem>
              <HandDrawnBox>
                <FeatureCard 
                  icon={<TrendingUp size={28} />}
                  title={t('improvementTips')}
                  description={t('improvementTipsDesc')}
                />
              </HandDrawnBox>
            </StaggerItem>
            <StaggerItem>
              <HandDrawnBox>
                <FeatureCard 
                  icon={<CheckCircle size={28} />}
                  title={t('atsOptimization')}
                  description={t('atsOptimizationDesc')}
                />
              </HandDrawnBox>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-navy-900 mb-4">{t('howItWorks')}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t('threeSimpleStepsCV')}</p>
            </div>
          </FadeInUp>

          <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <StepCard 
                number="1"
                title={t('uploadCVs')}
                description={t('uploadCVsDesc')}
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard 
                number="2"
                title={t('getResults')}
                description={t('getResultsDesc')}
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard 
                number="3"
                title={t('improvementTips')}
                description={t('improvementTipsDesc')}
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <FadeInUp>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Pencil size={16} />
              <span className="text-sm font-medium">{t('join1000Talents')}</span>
            </div>
            
            <h2 className="font-serif text-4xl font-bold mb-6">{t('standOut')}</h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              {t('standOutDesc')}
            </p>
          </div>
          <FadeInUp delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signin?role=candidate"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-sm hover:bg-warm-50 transition-all font-bold"
            >
              <Upload size={20} />
              {t('analyzeMyCV')}
            </Link>
            <Link 
              to="/signin?role=candidate"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-sm hover:bg-white/10 transition-all"
            >
              <FileText size={20} />
              {t('seeDemoResults')}
            </Link>
          </div>
          </FadeInUp>
        </FadeInUp>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-warm-50 rounded-lg p-8 border border-warm-200 hover:border-orange-500 transition-all group">
    <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="relative">
    <div className="bg-white rounded-lg p-8 paper-shadow border border-warm-200 h-full">
      <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-serif font-bold text-xl mb-6">
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

export default CandidateLanding;