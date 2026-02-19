import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, Upload, Users, Pencil, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                onClick={() => { setShowRoleModal(false); setIsMobileMenuOpen(false); }}
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
                onClick={() => { setShowRoleModal(false); setIsMobileMenuOpen(false); }}
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

      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-warm-white/90 backdrop-blur-md shadow-sm' : 'bg-warm-white/90 backdrop-blur-md'
      } border-b border-warm-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {/* Hirevion Logo Icon */}
            <div className="relative w-10 h-10">
              {/* Pencil body */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg transform rotate-12 flex items-center justify-center shadow-lg">
                <Pencil size={20} className="text-white transform -rotate-12" />
              </div>
              {/* Accent dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-navy-900 tracking-tight leading-none">
                Hirevion
              </span>
              <span className="text-[10px] text-orange-500 font-medium tracking-[0.2em] uppercase">
                Smart Hiring
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-sm uppercase tracking-wider font-medium transition-colors ${
                isActive('/') ? 'text-navy-800 font-bold border-b-2 border-navy-800' : 'text-gray-600 hover:text-navy-800'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/candidate" 
              className={`text-sm uppercase tracking-wider font-medium transition-colors ${
                isActive('/candidate') ? 'text-navy-800 font-bold border-b-2 border-navy-800' : 'text-gray-600 hover:text-navy-800'
              }`}
            >
              For Candidates
            </Link>
            <Link 
              to="/recruiter" 
              className={`text-sm uppercase tracking-wider font-medium transition-colors ${
                isActive('/recruiter') ? 'text-navy-800 font-bold border-b-2 border-navy-800' : 'text-gray-600 hover:text-navy-800'
              }`}
            >
              For Recruiters
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setShowRoleModal(true)}
              className="bg-navy-800 text-white px-5 py-2.5 rounded-sm hover:bg-navy-900 transition-all shadow-sm hover:shadow-md font-medium text-sm flex items-center gap-2"
            >
              <Rocket size={16} />
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-warm-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-navy-800 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/candidate" 
                className="text-gray-600 hover:text-navy-800 font-medium flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Upload size={16} />
                For Candidates
              </Link>
              <Link 
                to="/recruiter" 
                className="text-gray-600 hover:text-navy-800 font-medium flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users size={16} />
                For Recruiters
              </Link>
              <button 
                onClick={() => { setShowRoleModal(true); }}
                className="bg-navy-800 text-white px-5 py-2.5 rounded-sm text-center font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
