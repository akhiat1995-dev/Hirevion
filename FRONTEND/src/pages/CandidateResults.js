import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, AlertCircle, ArrowLeft, Download, RefreshCw,
  TrendingUp, Briefcase, Award, Star, AlertTriangle,
  Brain, FileText, ChevronRight, Zap, Lightbulb
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PencilLoading, PencilProgressBar } from '../components/PencilDesigns';
import '../components/PencilDesigns.css';

const CandidateResults = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Check if result data exists in location.state
    if (location.state?.result) {
      console.log('✅ Candidate result received:', location.state.result);
      setResult(location.state.result);
      setLoading(false);
    } else {
      console.log('❌ No candidate result data in location.state');
      setError('No analysis results found. Please upload your CV first.');
      setLoading(false);
    }
  }, [location.state]);

  // Debug: Log what we're rendering
  console.log('CandidateResults component render:', { loading, error, result });

  if (loading) {
    return (
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PencilLoading text="Our AI is analyzing your CV..." />
        <div className="mt-8 max-w-md mx-auto">
          <PencilProgressBar progress={45} label="Extracting skills and experience..." />
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-orange-500 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-4">No Analysis Results</h1>
        <p className="text-gray-600 mb-6">{error || 'Please upload your CV to see the analysis.'}</p>
        <Link 
          to="/candidate" 
          className="inline-flex items-center gap-2 bg-navy-800 text-white px-6 py-3 rounded-sm hover:bg-navy-900 transition-all"
        >
          <ArrowLeft size={18} />
          Upload Your CV
        </Link>
      </div>
    );
  }

  // Safely extract data with fallbacks
  const candidateInfo = result.candidate_info || {};
  const skills = result.skills || [];
  const experience = result.experience_years || 0;
  const summary = result.summary || '';
  const analysis = result.analysis || {};
  const report = result.report || {};
  
  const sectionRatings = analysis?.section_ratings || {};
  const overallScore = analysis?.overall_score || 0;
  const atsScore = sectionRatings?.contact_info?.score || sectionRatings?.skills?.score || 0;
  const contentScore = sectionRatings?.experience?.score || sectionRatings?.summary?.score || 0;
  const formatScore = sectionRatings?.education?.score || sectionRatings?.projects?.score || 0;
  
  const scoreData = [
    { name: 'ATS Optimization', value: atsScore, color: '#2C5282' },
    { name: 'Content Quality', value: contentScore, color: '#10B981' },
    { name: 'Format & Structure', value: formatScore, color: '#F59E0B' },
  ];

  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const recommendations = analysis?.improvement_tips || report?.english?.recommendations || [];

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/candidate" className="hover:text-navy-800">Upload CV</Link>
            <ChevronRight size={14} />
            <span className="text-navy-800 font-medium">Analysis Results</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Your CV Analysis</h1>
          <p className="text-gray-600 mt-1">
            {candidateInfo?.name ? `Analysis for ${candidateInfo.name}` : 'Detailed AI-powered assessment of your CV'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-warm-200 rounded-sm hover:bg-warm-50 transition-all text-sm"
          >
            <Download size={16} />
            Save Report
          </button>
          <Link 
            to="/candidate" 
            className="flex items-center gap-2 bg-navy-800 text-white px-4 py-2 rounded-sm hover:bg-navy-900 transition-all text-sm"
          >
            <RefreshCw size={16} />
            Analyze Another CV
          </Link>
        </div>
      </div>

      {/* Main Score Card */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-xl p-6 md:p-8 text-white mb-8 shadow-xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Score Circle */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#10B981" 
                  strokeWidth="8" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * overallScore) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-serif font-bold">{overallScore}</span>
                <span className="text-sm text-white/70 uppercase tracking-wider">Overall Score</span>
              </div>
            </div>
            
            {/* Score Label */}
            <div className="mt-4 text-center md:text-left">
              {overallScore >= 80 && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300">
                  <Star size={16} fill="currentColor" /> Excellent CV
                </span>
              )}
              {overallScore >= 60 && overallScore < 80 && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300">
                  <TrendingUp size={16} /> Good CV
                </span>
              )}
              {overallScore < 60 && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full text-yellow-300">
                  <Lightbulb size={16} /> Needs Improvement
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Stats */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold mb-4">Score Breakdown</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">ATS Optimization</span>
                  <span className="font-bold">{atsScore}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${atsScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">Content Quality</span>
                  <span className="font-bold">{contentScore}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${contentScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">Format & Structure</span>
                  <span className="font-bold">{formatScore}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${formatScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Briefcase size={16} />
                <span>{experience} Years Experience Detected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          {summary && (
            <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Profile Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-serif text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle size={20} />
                Your Strengths
              </h3>
              <ul className="space-y-3">
                {strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {weaknesses.length > 0 && (
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h3 className="font-serif text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {weaknesses.map((weakness, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-navy-50 rounded-lg p-6 border border-navy-200">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Lightbulb size={20} />
                AI Recommendations
              </h3>
              <ul className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <Zap size={18} className="text-navy-600 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Report */}
          {report?.english && (
            <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Award size={20} />
                Detailed Analysis
              </h3>
              
              {report.english.executive_summary && (
                <div className="mb-4">
                  <h4 className="font-bold text-navy-800 mb-2">Executive Summary</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{report.english.executive_summary}</p>
                </div>
              )}
              
              {report.english.detailed_feedback && (
                <div className="mb-4">
                  <h4 className="font-bold text-navy-800 mb-2">Detailed Feedback</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{report.english.detailed_feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Skills & Info */}
        <div className="space-y-6">
          {/* Skills Cloud */}
          {skills.length > 0 && (
            <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
              <h3 className="font-serif text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Brain size={18} />
                Skills Detected
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 bg-navy-50 text-navy-800 text-sm rounded border border-navy-100 hover:bg-navy-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {skills.length} skills identified in your CV
              </p>
            </div>
          )}

          {/* Candidate Info */}
          <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
            <h3 className="font-serif text-lg font-bold text-navy-900 mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              {candidateInfo?.name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-navy-900">{candidateInfo.name}</span>
                </div>
              )}
              {candidateInfo?.email && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-navy-900">{candidateInfo.email}</span>
                </div>
              )}
              {candidateInfo?.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-navy-900">{candidateInfo.phone}</span>
                </div>
              )}
              {candidateInfo?.address && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-navy-900">{candidateInfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Score Chart */}
          <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
            <h3 className="font-serif text-lg font-bold text-navy-900 mb-4">Score Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-navy-900 text-white rounded-lg p-6">
            <h3 className="font-serif text-lg font-bold mb-3">Next Steps</h3>
            <p className="text-sm text-white/80 mb-4">
              Improve your CV based on our recommendations and increase your chances of getting hired!
            </p>
            <Link 
              to="/recruiter" 
              className="block w-full text-center bg-white text-navy-900 py-3 rounded-sm font-bold hover:bg-warm-50 transition-colors"
            >
              View Job Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateResults;
