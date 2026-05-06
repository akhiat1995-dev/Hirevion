import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Upload, Users, Pencil, Sparkles, X, ChevronRight } from 'lucide-react';
import { PencilUnderline, HandDrawnBox } from '../components/PencilDesigns';
import { useLanguage } from '../context/LanguageContext';
import '../components/PencilDesigns.css';

const FloatingPencil = ({ top, left, right, bottom, rotation = 0, delay = 0 }) => (
  <div 
    className="absolute pointer-events-none animate-float"
    style={{ 
      top, left, right, bottom,
      transform: `rotate(${rotation}deg)`,
      animationDelay: `${delay}s`,
      opacity: 0.08
    }}
  >
    <svg width="80" height="160" viewBox="0 0 30 60">
      <rect x="10" y="10" width="10" height="40" fill="#2C5282" rx="1"/>
      <polygon points="10,50 20,50 15,58" fill="#F6AD55"/>
      <polygon points="10,10 15,2 20,10" fill="#FBD38D"/>
    </svg>
  </div>
);

const HirevionLogo = () => (
  <div className="flex items-center justify-center gap-3 mb-8">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg transform rotate-12 flex items-center justify-center shadow-lg">
        <Pencil size={24} className="text-white transform -rotate-12" />
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
    </div>
    <h1 className="text-4xl font-serif font-bold text-navy-900 tracking-wide">HIREVION</h1>
  </div>
);

const Home = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-warm-white to-warm-100 relative overflow-hidden">
      {/* Floating Pencils */}
      <FloatingPencil top="10%" left="5%" rotation={-20} delay={0} />
      <FloatingPencil top="15%" right="8%" rotation={25} delay={1} />
      <FloatingPencil bottom="25%" left="10%" rotation={45} delay={2} />
      <FloatingPencil bottom="20%" right="5%" rotation={-35} delay={1.5} />
      
      <div className="text-center px-4 relative z-10 max-w-4xl">
        <HirevionLogo />
        
        <h2 className="text-2xl font-semibold text-navy-900 mb-2">
          {t('chooseYourPath')}
        </h2>
        <p className="text-gray-600 mb-12">
          {t('selectHowUseHirevion')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Recruiter Card */}
          <Link 
            to="/recruiter-landing"
            className="group relative bg-white p-8 rounded-xl border-2 border-warm-200 hover:border-navy-800 hover:shadow-xl transition-all min-w-[280px]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-navy-800/5 rounded-full blur-2xl group-hover:bg-navy-800/10 transition-all"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">{t('jeSuisRecruteur')}</h3>
              <p className="text-gray-500 text-sm mb-4">{t('imHiring')}</p>
              
              <div className="flex items-center justify-center gap-2 text-navy-800 font-medium">
                <span>{t('exploreHiring')}</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          {/* Candidate Card */}
          <Link 
            to="/candidate-landing"
            className="group relative bg-white p-8 rounded-xl border-2 border-warm-200 hover:border-orange-500 hover:shadow-xl transition-all min-w-[280px]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">{t('jeSuisTalent')}</h3>
              <p className="text-gray-500 text-sm mb-4">{t('iWantToAnalyze')}</p>
              
              <div className="flex items-center justify-center gap-2 text-orange-500 font-medium">
                <span>{t('analyzeMyCV')}</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;