import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, Brain, FileSearch, History, Trash2, Eye, TrendingUp } from 'lucide-react';
import { analyzeCV, getCVs, deleteCV } from '../services/api';

const CandidateUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await getCVs();
      if (response.success) {
        setHistory(response.cvs || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeleteCV = async (cvId) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        await deleteCV(cvId);
        fetchHistory();
      } catch (err) {
        console.error('Error deleting CV:', err);
      }
    }
  };

  const viewCV = async (cvId) => {
    try {
      const response = await getCVs();
      const cv = response.cvs?.find(c => c.id === cvId);
      if (cv?.parsed_data) {
        navigate('/candidate/results', { state: { result: cv.parsed_data } });
      }
    } catch (err) {
      console.error('Error viewing CV:', err);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a CV file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📤 Uploading CV for analysis...');
      const response = await analyzeCV(file);
      console.log('✅ Analysis complete:', response);
      
      const resultData = response.data || response;
      navigate('/candidate/results', { state: { result: resultData } });
    } catch (err) {
      console.error('❌ Analysis error:', err);
      
      // Check for rate limit error
      const errorMessage = err.response?.data?.detail || '';
      if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
        setError(
          '⚠️ AI Service Busy: We\'ve reached the daily analysis limit. ' +
          'Please try again in 10-15 minutes, or contact support to upgrade your account.'
        );
      } else {
        setError(errorMessage || 'An error occurred while analyzing your CV. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-navy-100 rounded-full mb-6">
          <FileSearch className="w-8 h-8 text-navy-800" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-navy-900 mb-4">Analyze Your CV</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your CV and get instant AI-powered analysis. Discover your strengths, 
          areas for improvement, and personalized recommendations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-warm-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'upload' 
              ? 'text-navy-800 border-b-2 border-navy-800' 
              : 'text-gray-500 hover:text-navy-800'
          }`}
        >
          <Upload size={18} />
          Upload CV
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'history' 
              ? 'text-navy-800 border-b-2 border-navy-800' 
              : 'text-gray-500 hover:text-navy-800'
          }`}
        >
          <History size={18} />
          History ({history.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'history' ? (
        <HistoryTab 
          history={history} 
          loading={loadingHistory} 
          onDelete={handleDeleteCV} 
          onView={viewCV} 
        />
      ) : (
        <UploadForm
          file={file}
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          removeFile={removeFile}
          error={error}
          isLoading={isLoading}
          handleAnalyze={handleAnalyze}
        />
      )}
    </div>
  );
};

// History Tab Component
const HistoryTab = ({ history, loading, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200 text-center">
        <Loader2 className="animate-spin mx-auto h-8 w-8 text-navy-800 mb-4" />
        <p className="text-gray-500">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200 text-center">
        <History className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="font-bold text-navy-900 mb-2">No History Yet</h3>
        <p className="text-gray-500">Upload and analyze a CV to see it here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg paper-shadow border border-warm-200 overflow-hidden">
      <div className="p-4 border-b border-warm-200 bg-gray-50">
        <h2 className="font-serif text-lg font-bold text-navy-900">Previously Analyzed CVs</h2>
      </div>
      <div className="divide-y divide-warm-200">
        {history.map((cv) => (
          <div key={cv.id} className="p-4 hover:bg-warm-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="text-navy-800" size={18} />
                  <h3 className="font-bold text-navy-900">{cv.parsed_data?.candidate_info?.name || cv.filename || 'Unknown'}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-warm-50 rounded flex items-center gap-1">
                    <TrendingUp size={14} />
                    Score: {cv.parsed_data?.analysis?.overall_score || 0}%
                  </span>
                  <span className="px-2 py-1 bg-warm-50 rounded">
                    {cv.parsed_data?.experience_years || 0} years exp
                  </span>
                  <span className="px-2 py-1 bg-warm-50 rounded">
                    {cv.parsed_data?.skills?.length || 0} skills
                  </span>
                </div>
                {cv.parsed_data?.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cv.parsed_data.skills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded">
                        {skill}
                      </span>
                    ))}
                    {cv.parsed_data.skills.length > 5 && (
                      <span className="text-xs text-gray-400">+{cv.parsed_data.skills.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onView(cv.id)}
                  className="p-2 text-gray-400 hover:text-navy-800 hover:bg-navy-50 rounded transition-colors"
                  title="View analysis"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onDelete(cv.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Upload Form Component
const UploadForm = ({ file, isDragActive, getRootProps, getInputProps, removeFile, error, isLoading, handleAnalyze }) => {
  return (
    <>
      <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200">
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`upload-zone rounded-lg p-12 text-center cursor-pointer mb-6 ${
            isDragActive ? 'dragover border-navy-800 bg-navy-50' : ''
          } ${file ? 'border-green-400 bg-green-50/30' : ''}`}
        >
          <input {...getInputProps()} />
          
          {file ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-green-700 font-medium">File ready for analysis</p>
              <p className="text-sm text-green-600 mt-1">{file.name}</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-navy-800 mb-4" />
              <p className="text-navy-800 font-medium">Drop your CV here...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                <span className="text-navy-800 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-400">PDF files only (max 10MB)</p>
            </div>
          )}
        </div>

        {/* File Info */}
        {file && (
          <div className="bg-warm-50 p-4 rounded-sm border border-warm-200 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-navy-800" size={24} />
                <div>
                  <p className="font-medium text-navy-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-red-50 rounded-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !file}
          className={`w-full py-4 rounded-sm font-medium flex items-center justify-center gap-2 transition-all ${
            isLoading || !file
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-navy-800 text-white hover:bg-navy-900 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing your CV...
            </>
          ) : (
            <>
              <Brain size={20} />
              {file ? 'Analyze My CV' : 'Upload CV to Start'}
            </>
          )}
        </button>

        {!file && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Upload a PDF file to get your personalized CV analysis
          </p>
        )}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <FeatureCard 
          icon="📊"
          title="Detailed Scoring"
          description="Get an overall score plus breakdowns for ATS optimization, content quality, and format."
        />
        <FeatureCard 
          icon="✨"
          title="Strengths Analysis"
          description="Discover what makes your CV stand out and what recruiters will love."
        />
        <FeatureCard 
          icon="💡"
          title="Improvement Tips"
          description="Receive personalized recommendations to improve your CV and increase your chances."
        />
      </div>
    </>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-6">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-bold text-navy-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default CandidateUpload;
