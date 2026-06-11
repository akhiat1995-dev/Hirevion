import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Users, Brain, Eye, LogIn, ArrowLeft, Award, FileText, UserCheck, Clock, AlertCircle, X, Play, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { FadeInUp } from '../components/ScrollAnimations';

const RecruiterDemo = () => {

  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [positions, setPositions] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles.map(f => ({ file: f, name: f.name }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const analyzeCVs = async () => {
    if (!jobTitle || !jobRequirements || files.length === 0) {
      alert('Please fill in job details and upload CVs');
      return;
    }

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('job_title', jobTitle);
      formData.append('number_of_positions', positions);
      formData.append('job_requirements', jobRequirements);
      files.forEach((f) => formData.append('cvs', f.file));

      const response = await api.post('/recruiter/hiring', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResults(response.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze CVs. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getStatusBadge = (status) => {
    const styles = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      potential: 'bg-orange-100 text-orange-800',
      not_suitable: 'bg-red-100 text-red-800'
    };
    const labels = { excellent: 'Excellent', good: 'Good', potential: 'Potential', not_suitable: 'Not Suitable' };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || styles.not_suitable}`}>{labels[status] || status}</span>;
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <Eye size={20} />
          <span className="font-medium">Demo Mode - Try real CV analysis without sign-up</span>
          <Link 
            to="/signin?role=recruiter"
            className="ml-4 inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <LogIn size={16} />
            Save Results
          </Link>
        </div>
      </div>

      {!results ? (
        <>
          {/* Header */}
          <header className="bg-navy-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/recruiter-landing" className="text-white hover:text-orange-500 transition-colors">
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1 className="text-xl font-bold">Hiring Workflow Demo</h1>
                  <p className="text-sm text-gray-300">Upload CVs and get AI-powered rankings</p>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Job Details */}
            <FadeInUp>
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-navy-900 mb-4">Step 1: Job Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Full Stack Developer"
                      className="w-full px-4 py-2 border border-warm-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Positions</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={positions}
                      onChange={(e) => setPositions(e.target.value)}
                      className="w-full px-4 py-2 border border-warm-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Requirements</label>
                  <textarea
                    value={jobRequirements}
                    onChange={(e) => setJobRequirements(e.target.value)}
                    placeholder="e.g., 5+ years experience, Python, React, AWS..."
                    rows={3}
                    className="w-full px-4 py-2 border border-warm-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </FadeInUp>

            {/* File Upload */}
            <FadeInUp delay={0.1}>
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-navy-900 mb-4">Step 2: Upload CVs (PDF)</h2>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-orange-500 bg-orange-50' : 'border-warm-200 hover:border-orange-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-orange-600">Drop the CVs here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-700 font-medium">Drag & drop CVs here</p>
                      <p className="text-sm text-gray-500">or click to select files (PDF only)</p>
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">{files.length} files selected:</p>
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-warm-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-orange-600" />
                          <span className="text-sm text-gray-700">{f.name}</span>
                        </div>
                        <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500">
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeInUp>

            {/* Analyze Button */}
            <FadeInUp delay={0.2}>
              <button
                onClick={analyzeCVs}
                disabled={analyzing || files.length === 0 || !jobTitle || !jobRequirements}
                className="w-full bg-navy-900 text-white py-4 rounded-xl font-medium hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Analyzing CVs with AI...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Analyze CVs ({files.length})
                  </>
                )}
              </button>
            </FadeInUp>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-sm text-orange-800 text-center">
                <strong>Free Demo:</strong> Analysis works without sign-up. 
                <Link to="/signin?role=recruiter" className="underline ml-1">Sign in</Link> to save results and access history.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Results */}
          <header className="bg-navy-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setResults(null)} className="text-white hover:text-orange-500 transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-bold">Analysis Results</h1>
                  <p className="text-sm text-gray-300">{results.job_title}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Stats */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-warm-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900">{results.upload_summary?.total_files || 0}</p>
                    <p className="text-sm text-gray-500">Total CVs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-warm-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <UserCheck className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">{results.selection_summary?.approved_count || 0}</p>
                    <p className="text-sm text-gray-500">Recommended</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-warm-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Clock className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-700">{positions}</p>
                    <p className="text-sm text-gray-500">Positions</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-warm-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-700">{results.selection_summary?.rejected_count || 0}</p>
                    <p className="text-sm text-gray-500">Not Suitable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rankings */}
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-warm-200">
                <h2 className="text-lg font-bold text-navy-900">Candidate Rankings</h2>
              </div>

              <div className="divide-y divide-warm-200">
                {(results.approved_candidates || []).concat(results.rejected_candidates || []).map((candidate, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-warm-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center text-sm font-bold text-navy-900">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-navy-900">{candidate.name}</h3>
                            {index < (results.selection_summary?.approved_count || 0) && <Award size={16} className="text-orange-500" />}
                          </div>
                          <p className="text-sm text-gray-500">{candidate.experience}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex gap-2">
                          {(candidate.skills || []).slice(0, 3).map(skill => (
                            <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {getStatusBadge(candidate.status)}

                        <div className={`w-16 h-10 rounded-lg flex items-center justify-center font-bold ${getScoreColor(candidate.overall_score)}`}>
                          {candidate.overall_score}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-navy-900 py-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Like the results?</h2>
              <p className="text-gray-300 mb-6">Create a free account to save results and access hiring history</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signin?role=recruiter"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-sm hover:bg-orange-600 transition-colors font-medium"
                >
                  <LogIn size={20} />
                  Sign Up Free
                </Link>
                <button 
                  onClick={() => setResults(null)}
                  className="inline-flex items-center justify-center gap-2 bg-white text-navy-800 px-6 py-3 rounded-sm hover:bg-gray-100 transition-colors font-medium"
                >
                  <Play size={20} />
                  Try Another
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecruiterDemo;