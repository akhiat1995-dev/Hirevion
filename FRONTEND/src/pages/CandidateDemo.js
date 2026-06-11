import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Brain, Target, CheckCircle, AlertCircle, ArrowLeft, Eye, LogIn, BarChart3, Award, Loader, X, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { FadeInUp } from '../components/ScrollAnimations';

const CandidateDemo = () => {

  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const analyzeCV = async () => {
    if (!file) {
      alert('Please upload a PDF CV');
      return;
    }

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/candidate/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResults(response.data.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze CV. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <Eye size={20} />
          <span className="font-medium">Demo Mode - Try real CV analysis without sign-up</span>
          <Link 
            to="/signin?role=candidate"
            className="ml-4 inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
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
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center gap-4">
                <Link to="/candidate-landing" className="text-white hover:text-orange-500 transition-colors">
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1 className="text-xl font-bold">CV Analysis Demo</h1>
                  <p className="text-sm text-gray-300">Upload your CV and get AI-powered insights</p>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Upload */}
            <FadeInUp>
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-navy-900 mb-4">Upload Your CV (PDF)</h2>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-orange-500 bg-orange-50' : 'border-warm-200 hover:border-orange-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-orange-600">Drop your CV here...</p>
                  ) : file ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText size={24} className="text-orange-600" />
                      <span className="font-medium text-gray-700">{file.name}</span>
                      <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 font-medium">Drag & drop your CV here</p>
                      <p className="text-sm text-gray-500">or click to select (PDF only)</p>
                    </div>
                  )}
                </div>
              </div>
            </FadeInUp>

            {/* Analyze Button */}
            <FadeInUp delay={0.1}>
              <button
                onClick={analyzeCV}
                disabled={analyzing || !file}
                className="w-full bg-navy-900 text-white py-4 rounded-xl font-medium hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Analyzing your CV...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Analyze My CV
                  </>
                )}
              </button>
            </FadeInUp>

            {/* Features */}
            <FadeInUp delay={0.2}>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <BarChart3 className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                  <p className="text-sm font-medium">Overall Score</p>
                </div>
                <div className="text-center p-4">
                  <Brain className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                  <p className="text-sm font-medium">Skill Detection</p>
                </div>
                <div className="text-center p-4">
                  <Target className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                  <p className="text-sm font-medium">Gap Analysis</p>
                </div>
              </div>
            </FadeInUp>

            {/* Demo Notice */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                <strong>Free Demo:</strong> Analysis works without sign-up. 
                <Link to="/signin?role=candidate" className="underline ml-1">Sign in</Link> to save results and track progress.
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
                  <p className="text-sm text-gray-300">{file?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Match Score</p>
                <p className="text-3xl font-bold text-green-400">{results.analysis?.overall_score || 0}%</p>
              </div>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Score Overview */}
            <FadeInUp>
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                      <circle cx="64" cy="64" r="56" stroke="#EA580C" strokeWidth="12" fill="none" 
                        strokeDasharray={`${((results.analysis?.overall_score || 0) / 100) * 352} 352`} 
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-navy-900">{results.analysis?.overall_score || 0}%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Technical Skills</span>
                        <span className="font-medium">{results.analysis?.technical_score || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${getScoreColor(results.analysis?.technical_score)}`} style={{width: `${results.analysis?.technical_score || 0}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-medium">{results.analysis?.experience_score || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${getScoreColor(results.analysis?.experience_score)}`} style={{width: `${results.analysis?.experience_score || 0}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Education</span>
                        <span className="font-medium">{results.analysis?.education_score || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${getScoreColor(results.analysis?.education_score)}`} style={{width: `${results.analysis?.education_score || 0}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>

            {/* Skills */}
            <FadeInUp delay={0.1}>
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-navy-900 mb-4">Identified Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {(results.skills || []).map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">{results.experience_years || 0} years of experience</p>
              </div>
            </FadeInUp>

            {/* Strengths */}
            <FadeInUp delay={0.2}>
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                  <Award className="text-orange-500" size={20} />
                  Key Strengths
                </h2>
                <ul className="space-y-3">
                  {(results.strengths || []).map((strength, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInUp>

            {/* Areas for Improvement */}
            <FadeInUp delay={0.3}>
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                  <Target className="text-orange-500" size={20} />
                  Areas for Improvement
                </h2>
                <ul className="space-y-3">
                  {(results.gaps || []).map((gap, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertCircle className="text-orange-500 mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-gray-700">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInUp>

            {/* Skill Gap */}
            {results.skill_gap && (
              <FadeInUp delay={0.4}>
                <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-bold text-navy-900 mb-4">Skill Gap Analysis</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">Recommended Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {(results.skill_gap.missing_skills || []).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">Transferable Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {(results.skill_gap.transferable_skills || []).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded text-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            )}
          </div>

          {/* CTA */}
          <div className="bg-navy-900 py-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Get Your Free CV Analysis</h2>
              <p className="text-gray-300 mb-6">Create an account to save results and track your progress</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signin?role=candidate"
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
                  Try Another CV
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidateDemo;