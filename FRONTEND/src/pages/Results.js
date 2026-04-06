import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, XCircle, AlertCircle, ArrowLeft, Download, 
  TrendingUp, Briefcase, Users, Award, Target,
  ChevronRight, Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PencilLoading, PencilProgressBar, PencilUnderline, PencilDivider } from '../components/PencilDesigns';
import '../components/PencilDesigns.css';

const Results = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Check if result data exists in location.state
    if (location.state?.result) {
      console.log('✅ Result data received:', location.state.result);
      setResult(location.state.result);
      setLoading(false);
    } else {
      console.log('❌ No result data in location.state');
      setError('No analysis results found. Please run an analysis first.');
      setLoading(false);
    }
  }, [location.state]);

  // Debug: Log what we're rendering
  console.log('Results component render:', { loading, error, result });

  if (loading) {
    return (
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PencilLoading text="Matching candidates with AI..." />
        <div className="mt-8 max-w-md mx-auto space-y-4">
          <PencilProgressBar progress={60} label="Analyzing CVs..." />
          <PencilProgressBar progress={40} label="Comparing with job requirements..." />
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-4">No Results Available</h1>
        <p className="text-gray-600 mb-6">{error || 'Please upload CVs and run an analysis first.'}</p>
        <Link 
          to="/recruiter" 
          className="inline-flex items-center gap-2 bg-navy-800 text-white px-6 py-3 rounded-sm hover:bg-navy-900 transition-all"
        >
          <ArrowLeft size={18} />
          Go to Recruiter Dashboard
        </Link>
      </div>
    );
  }

  // Safely extract data with fallbacks
  const job_summary = result.job_summary || {};
  const selection_summary = result.selection_summary || {};
  const approved_candidates = result.approved_candidates || [];
  const rejected_candidates = result.rejected_candidates || [];
  const hiring_recommendations = result.hiring_recommendations || [];

  // Debug log
  console.log('Extracted data:', {
    job_summary,
    selection_summary,
    approved_count: approved_candidates.length,
    rejected_count: rejected_candidates.length
  });

  // Prepare chart data with safety checks
  const tierData = selection_summary?.tier_distribution ? [
    { name: 'Excellent', count: selection_summary.tier_distribution.excellent || 0, color: '#10B981' },
    { name: 'Good', count: selection_summary.tier_distribution.good || 0, color: '#2C5282' },
    { name: 'Potential', count: selection_summary.tier_distribution.potential || 0, color: '#F59E0B' },
    { name: 'Not Suitable', count: selection_summary.tier_distribution.not_suitable || 0, color: '#EF4444' },
  ] : [];

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="recruiter-report">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/recruiter" className="hover:text-navy-800">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="text-navy-800 font-medium">Analysis Results</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">
            <PencilUnderline>Match Analysis</PencilUnderline> Results
          </h1>
          <p className="text-gray-600 mt-1">
            Job: {job_summary?.title || 'Unknown'} 
            {selection_summary?.total_candidates > 0 && (
              <span className="ml-2 text-sm bg-navy-100 text-navy-800 px-2 py-0.5 rounded">
                {selection_summary.total_candidates} candidates analyzed
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-warm-200 rounded-sm hover:bg-warm-50 transition-all text-sm"
          >
            <Download size={16} />
            Export Report
          </button>
          <Link 
            to="/recruiter" 
            className="flex items-center gap-2 bg-navy-800 text-white px-4 py-2 rounded-sm hover:bg-navy-900 transition-all text-sm"
          >
            <ArrowLeft size={16} />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Pencil Divider */}
      <PencilDivider text="Analysis Complete" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <SummaryCard 
          icon={<Users className="text-blue-600" size={20} />}
          label="Total Candidates"
          value={selection_summary?.total_candidates || 0}
        />
        <SummaryCard 
          icon={<CheckCircle className="text-green-600" size={20} />}
          label="Approved"
          value={selection_summary?.approved_count || 0}
          highlight="bg-green-50"
        />
        <SummaryCard 
          icon={<XCircle className="text-red-500" size={20} />}
          label="Not Selected"
          value={selection_summary?.rejected_count || 0}
        />
        <SummaryCard 
          icon={<Target className="text-purple-600" size={20} />}
          label="Positions"
          value={`${selection_summary?.approved_count || 0}/${job_summary?.positions_available || 0}`}
          subtext={selection_summary?.all_positions_filled ? '✅ All filled' : '⏳ In progress'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Stats & Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tier Distribution Chart */}
          {tierData.length > 0 && (
            <div className="bg-white rounded-lg paper-shadow p-4 md:p-6 border border-warm-200">
              <h3 className="font-serif text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} />
                Candidate Tiers
              </h3>
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tierData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 11}} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {tierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {tierData.map((tier, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: tier.color }}></div>
                    <span className="text-gray-600">{tier.name}: {tier.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Summary */}
          <div className="bg-white rounded-lg paper-shadow p-4 md:p-6 border border-warm-200">
            <h3 className="font-serif text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Briefcase size={18} />
              Job Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-warm-100 pb-2">
                <span className="text-gray-500">Title:</span>
                <span className="font-medium text-navy-900 text-right">{job_summary?.title || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-warm-100 pb-2">
                <span className="text-gray-500">Domain:</span>
                <span className="font-medium text-navy-900">{job_summary?.domain || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-warm-100 pb-2">
                <span className="text-gray-500">Seniority:</span>
                <span className="font-medium text-navy-900">{job_summary?.seniority || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Experience:</span>
                <span className="font-medium text-navy-900">
                  {job_summary?.experience_required?.min_years || 0}+ years
                </span>
              </div>
            </div>
            
            {/* Required Skills */}
            {job_summary?.required_skills?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-warm-200">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Key Skills Required</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job_summary.required_skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-navy-50 text-navy-800 text-xs rounded border border-navy-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {hiring_recommendations?.length > 0 && (
            <div className="bg-navy-50 rounded-lg p-4 md:p-6 border border-navy-100">
              <h3 className="font-serif text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Award size={18} />
                Recommendations
              </h3>
              <ul className="space-y-3">
                {hiring_recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-navy-800 font-bold flex-shrink-0">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column - Candidates List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Approved Candidates */}
          {approved_candidates?.length > 0 ? (
            <div className="bg-white rounded-lg paper-shadow border border-warm-200 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-warm-200 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={24} />
                      Selected Candidates
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {approved_candidates.length} candidate{approved_candidates.length !== 1 ? 's' : ''} approved for interview
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-serif font-bold text-green-600">
                      {Math.round(approved_candidates.reduce((acc, c) => acc + (c.matching_details?.overall_score || 0), 0) / approved_candidates.length)}%
                    </div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-warm-200 max-h-[600px] overflow-y-auto">
                {approved_candidates.map((candidate, index) => (
                  <CandidateCard key={candidate.cv_id || index} candidate={candidate} approved={true} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-600 mb-3" />
              <h3 className="font-bold text-navy-900 mb-2">No Candidates Approved</h3>
              <p className="text-gray-600 text-sm">No candidates met the minimum requirements for this position.</p>
            </div>
          )}

          {/* Rejected Candidates */}
          {rejected_candidates?.length > 0 && (
            <div className="bg-white rounded-lg paper-shadow border border-warm-200 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-warm-200 bg-gray-50">
                <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2">
                  <XCircle className="text-gray-400" size={24} />
                  Not Selected
                  <span className="text-sm font-normal text-gray-500 ml-2">({rejected_candidates.length})</span>
                </h2>
              </div>
              <div className="divide-y divide-warm-200 max-h-[400px] overflow-y-auto">
                {rejected_candidates.slice(0, 5).map((candidate, index) => (
                  <CandidateCard key={candidate.cv_id || index} candidate={candidate} approved={false} />
                ))}
              </div>
              {rejected_candidates.length > 5 && (
                <div className="p-4 text-center text-sm text-gray-500 border-t border-warm-200 bg-gray-50">
                  +{rejected_candidates.length - 5} more candidates not shown
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, label, value, subtext, highlight }) => (
  <div className={`bg-white rounded-lg paper-shadow p-4 border border-warm-200 ${highlight || ''}`}>
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-warm-50 rounded-sm">{icon}</div>
    </div>
    <div className="text-2xl md:text-3xl font-serif font-bold text-navy-900">{value}</div>
    <div className="text-xs md:text-sm text-gray-600">{label}</div>
    {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
  </div>
);

// Candidate Card Component
const CandidateCard = ({ candidate, approved }) => {
  const score = candidate?.matching_details?.overall_score || 0;
  const tier = candidate?.matching_details?.tier || 'unknown';
  const name = candidate?.candidate_name || 'Unknown Candidate';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  const getTierColor = (tier) => {
    switch(tier) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'potential': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  return (
    <div className="p-4 md:p-6 hover:bg-warm-50 transition-colors">
      <div className="flex items-start gap-3 md:gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center font-bold text-sm md:text-lg flex-shrink-0">
          {initials}
        </div>
        
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-navy-900 text-base md:text-lg truncate">{name}</h3>
              <p className="text-xs text-gray-500 truncate">{candidate?.filename}</p>
              
              {/* Score & Tier */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`text-xl md:text-2xl font-serif font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded border capitalize ${getTierColor(tier)}`}>
                  {tier}
                </span>
                {approved && candidate?.rank && (
                  <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                    <Star size={12} fill="currentColor" />
                    Rank #{candidate.rank}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          {candidate?.skills_analysis?.required_matched?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {candidate.skills_analysis.required_matched.slice(0, 4).map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded border border-green-100">
                    ✓ {skill}
                  </span>
                ))}
                {candidate.skills_analysis.required_matched.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-gray-500">
                    +{candidate.skills_analysis.required_matched.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="mt-3 text-sm">
            {approved ? (
              <div className="text-gray-700">
                <span className="font-medium text-green-600">✓ Selected:</span>{' '}
                {candidate.selection_reason || 'Meets requirements'}
              </div>
            ) : (
              <div className="text-gray-700">
                <span className="font-medium text-gray-500">Not selected:</span>{' '}
                {candidate.rejection_reason || 'Does not meet requirements'}
              </div>
            )}
          </div>

          {/* Strengths */}
          {candidate?.strengths?.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <TrendingUp size={12} className="text-green-600" />
              <span>Strengths: {candidate.strengths.slice(0, 2).join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
