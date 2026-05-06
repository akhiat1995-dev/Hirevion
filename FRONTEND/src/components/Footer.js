import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg transform rotate-12 flex items-center justify-center">
                  <Pencil size={20} className="text-white transform -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-navy-900"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white leading-none">Hirevion</span>
                <span className="text-[10px] text-orange-400 tracking-[0.2em] uppercase">Smart Hiring</span>
              </div>
            </div>
            <p className="text-navy-200 text-sm mb-6 leading-relaxed">
              {t('footerTagline')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center text-navy-300 hover:bg-orange-500 hover:text-white transition-all" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center text-navy-300 hover:bg-orange-500 hover:text-white transition-all" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center text-navy-300 hover:bg-orange-500 hover:text-white transition-all" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/candidate" className="text-navy-300 hover:text-orange-400 transition-colors text-sm">
                  {t('forCandidates')}
                </Link>
              </li>
              <li>
                <Link to="/recruiter" className="text-navy-300 hover:text-orange-400 transition-colors text-sm">
                  {t('forRecruiters')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-navy-300 hover:text-orange-400 transition-colors text-sm">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-navy-300 hover:text-orange-400 transition-colors text-sm">
                  {t('careers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">{t('resources')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-navy-300 hover:text-orange-400 transition-colors text-sm">
                  {t('helpCenter')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-navy-300 hover:text-orange-400 transition-colors text-sm">
                  {t('documentation')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-navy-300 hover:text-orange-400 transition-colors text-sm">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-navy-300 hover:text-orange-400 transition-colors text-sm">
                  {t('api')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">{t('contactUs')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-400 mt-0.5" size={18} />
                <span className="text-navy-300 text-sm">123 Innovation Street<br />Tech City, TC 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-orange-400" size={18} />
                <a href="mailto:hello@hirevion.com" className="text-navy-300 hover:text-orange-400 text-sm">
                  hello@hirevion.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-orange-400" size={18} />
                <a href="tel:+1234567890" className="text-navy-300 hover:text-orange-400 text-sm">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-b border-navy-800 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white">{t('security')}</div>
              <div className="text-navy-300 text-sm">{t('securityDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white">{t('gdpr')}</div>
              <div className="text-navy-300 text-sm">{t('gdprDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white">{t('support')}</div>
              <div className="text-navy-300 text-sm">{t('supportDesc')}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-navy-800">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-navy-300">
            <p>&copy; 2024 Hirevion. {t('allRightsReserved')}</p>
            <div className="hidden md:block w-1 h-1 bg-navy-600 rounded-full"></div>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-orange-400 transition-colors">{t('privacy')}</Link>
              <Link to="/" className="hover:text-orange-400 transition-colors">{t('terms')}</Link>
              <Link to="/" className="hover:text-orange-400 transition-colors">{t('cookies')}</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-navy-300 text-sm">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;