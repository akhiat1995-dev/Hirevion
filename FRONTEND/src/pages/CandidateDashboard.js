import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, TrendingUp, Award, Calendar, Trash2, Eye, ChevronRight, BarChart3, AlertCircle } from 'lucide-react';
import { getCVs, deleteCV } from '../services/api';
import { PencilUnderline } from '../components/PencilDesigns';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [cvs, setCVs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const response = await getCVs();
      setCVs(response.cvs || []);
    } catch (err) {
      console.error('Error fetching CVs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (cvId) => {
    if (!window.confirm('Are you sure you want to delete this CV?')) return;
    try {
      await deleteCV(cvId);
      setCVs(prev => prev.filter(cv => cv.id !== cvId));
    } catch (err) {
      console.error('Error deleting CV:', err);
    }
  };

  const handleViewCV = (cv) => {
    navigate('/candidate/results', { state: { result: cv.parsed_data, cv } });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const avgScore = cvs.length > 0
    ? Math.round(cvs.reduce((sum, cv) => sum + (cv.parsed_data?.analysis?.overall_score || 0), 0) / cvs.length)
    : 0;

  const totalSkills = [...new Set(cvs.flatMap(cv => cv.parsed_data?.skills || []))];

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      {/* Current Location Banner */}
      <div className="bg-navy-900 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold">You are in the Candidate Dashboard</h2>
            <p className="text-white/70 text-sm">Track your CV analysis history and improvement progress</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
          <FileText size={14} />
          <span>{cvs.length} CVs</span>
          <span className="text-white/40">•</span>
          <TrendingUp size={14} />
          <span>Avg: {avgScore}%</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Overview</span>
          <span className="text-xs">/</span>
          <span className="text-navy-800 font-medium">Candidate Dashboard</span>
        </div>
        <h1 className="font-serif text-4xl text-navy-900 font-bold">
          <PencilUnderline>My CVs</PencilUnderline> Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Track your CV analysis history and improvement progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FileText className="text-blue-600" size={20} />} label="Total CVs" value={cvs.length} color="blue" />
        <StatCard icon={<TrendingUp className="text-green-600" size={20} />} label="Avg Score" value={`${avgScore}%`} color="green" />
        <StatCard icon={<Award className="text-purple-600" size={20} />} label="Skills Found" value={totalSkills.length} color="purple" />
        <StatCard icon={<BarChart3 className="text-orange-600" size={20} />} label="Latest Score" value={cvs.length > 0 ? `${cvs[0].parsed_data?.analysis?.overall_score || 0}%` : '—'} color="orange" />
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/candidate')}
          className="bg-navy-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-800 transition-colors flex items-center gap-2"
        >
          <Upload size={18} /> Upload New CV
        </button>
      </div>

      {/* CV History */}
      {loading ? (
        <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200 text-center">
          <div className="animate-spin mx-auto h-8 w-8 border-2 border-navy-800 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500">Loading your CVs...</p>
        </div>
      ) : cvs.length === 0 ? (
        <div className="bg-white rounded-lg paper-shadow p-12 border border-warm-200 text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">No CVs Uploaded Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Upload your first CV to get an AI-powered analysis with score, skills detection, and improvement tips.</p>
          <button
            onClick={() => navigate('/candidate')}
            className="bg-navy-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-800 transition-colors inline-flex items-center gap-2"
          >
            <Upload size={18} /> Upload Your CV
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-navy-900">
            CV History
            <span className="text-sm font-normal text-gray-500 ml-2">({cvs.length} CVs)</span>
          </h2>
          {cvs.map((cv) => {
            const analysis = cv.parsed_data?.analysis || {};
            const info = cv.parsed_data?.candidate_info || {};
            const score = analysis.overall_score || 0;

            return (
              <div key={cv.id} className="bg-white rounded-lg paper-shadow border border-warm-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-navy-800" size={20} />
                        <h3 className="font-bold text-navy-900">{cv.filename || 'Unknown CV'}</h3>
                      </div>

                      {info.name && (
                        <p className="text-sm text-gray-600 mb-2">{info.name}</p>
                      )}

                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className={`px-3 py-1 rounded text-sm font-bold ${getScoreColor(score)} bg-opacity-10`}
                          style={{ backgroundColor: `${getScoreColor(score).includes('green') ? '#dcfce7' : getScoreColor(score).includes('blue') ? '#dbeafe' : getScoreColor(score).includes('yellow') ? '#fef9c3' : '#fee2e2'}` }}>
                          {score}% — {getScoreLabel(score)}
                        </span>
                        {analysis.skills?.length > 0 && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                            {analysis.skills.length} skills
                          </span>
                        )}
                        {cv.parsed_data?.experience_years > 0 && (
                          <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded text-sm">
                            {cv.parsed_data.experience_years} yrs exp
                          </span>
                        )}
                      </div>

                      {analysis.strengths?.length > 0 && (
                        <div className="mt-3">
                          <span className="text-xs font-medium text-green-600">Strengths:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.strengths.slice(0, 3).map((s, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>{formatDate(cv.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleViewCV(cv)}
                        className="p-2 text-navy-800 hover:bg-navy-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteCV(cv.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const StatCard = ({ icon, label, value, color }) => {
  const bgColors = { blue: 'bg-blue-50', green: 'bg-green-50', purple: 'bg-purple-50', orange: 'bg-orange-50' };
  return (
    <div className="bg-white rounded-lg paper-shadow p-4 border border-warm-200">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-sm ${bgColors[color]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-serif font-bold text-navy-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};
