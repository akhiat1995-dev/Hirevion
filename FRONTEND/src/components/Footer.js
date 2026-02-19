import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-warm-white pt-16 pb-8 border-t border-warm-200 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* Logo Icon */}
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg transform rotate-12 flex items-center justify-center">
                  <Pencil size={16} className="text-white transform -rotate-12" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-navy-900 leading-none">Hirevion</span>
                <span className="text-[9px] text-orange-500 tracking-[0.15em] uppercase">Smart Hiring</span>
              </div>
            </div>
            <p className="text-gray-500 max-w-xs mb-6">
              AI-powered recruitment platform connecting talent with opportunity. Making hiring smarter, faster, and more human.
            </p>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-navy-800 transition-colors p-2" aria-label="LinkedIn">
                <Linkedin size={20} />
              </button>
              <button className="text-gray-400 hover:text-navy-800 transition-colors p-2" aria-label="Twitter">
                <Twitter size={20} />
              </button>
            </div>
          </div>
          
          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-navy-900 mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/candidate" className="text-gray-600 hover:text-navy-800 transition-colors">
                  For Candidates
                </Link>
              </li>
              <li>
                <Link to="/recruiter" className="text-gray-600 hover:text-navy-800 transition-colors">
                  For Recruiters
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-navy-800 transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-navy-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-600 hover:text-navy-800 transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-navy-800 transition-colors text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-warm-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; 2024 Hirevion. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
