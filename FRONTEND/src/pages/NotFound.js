import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-serif font-bold text-navy-900 mb-4">404</div>
        <h1 className="font-serif text-2xl font-bold text-navy-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-navy-800 transition-colors flex items-center gap-2">
            <Home size={18} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="border-2 border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:border-gray-300 transition-colors flex items-center gap-2">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
