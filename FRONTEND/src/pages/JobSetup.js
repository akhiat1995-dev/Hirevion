import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowLeft } from 'lucide-react';

const JobSetup = () => {
  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center">
        <Briefcase className="mx-auto h-16 w-16 text-navy-800 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-4">Job Setup</h1>
        <p className="text-gray-600 mb-8">
          This feature allows you to create and manage job postings. 
          Use the Recruiter Dashboard to upload CVs and match candidates.
        </p>
        <Link 
          to="/recruiter" 
          className="inline-flex items-center gap-2 bg-navy-800 text-white px-6 py-3 rounded-sm hover:bg-navy-900 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Recruiter Dashboard
        </Link>
      </div>
    </div>
  );
};

export default JobSetup;
