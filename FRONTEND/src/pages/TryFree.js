import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, Brain, FileSearch, Sparkles } from 'lucide-react';
import { tryFreeAnalyze } from '../services/api';

const TryFree = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
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
      const response = await tryFreeAnalyze(file);
      const resultData = response.data || response;
      navigate('/candidate/results', { state: { result: resultData, fromTryFree: true } });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || '';
      if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
        setError('AI Service Busy: We\'ve reached the daily analysis limit. Please try again later.');
      } else {
        setError(errorMessage || 'An error occurred while analyzing your CV. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
          <Sparkles className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-navy-900 mb-4">Try Free CV Analysis</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          No account needed. Upload your CV and get instant AI-powered analysis 
          to discover your strengths and improvement areas.
        </p>
      </div>

      <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200">
        <div
          {...getRootProps()}
          className={`upload-zone rounded-lg p-12 text-center cursor-pointer mb-6 ${
            isDragActive ? 'dragover border-orange-500 bg-orange-50' : ''
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
              <Upload className="h-12 w-12 text-orange-500 mb-4" />
              <p className="text-orange-700 font-medium">Drop your CV here...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                <span className="text-orange-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-400">PDF files only (max 10MB)</p>
            </div>
          )}
        </div>

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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !file}
          className={`w-full py-4 rounded-sm font-medium flex items-center justify-center gap-2 transition-all ${
            isLoading || !file
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
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
            Upload a PDF to get your free CV analysis
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-navy-900 mb-2">Detailed Scoring</h3>
          <p className="text-sm text-gray-600">Get an overall score with breakdowns for skills, experience, and education.</p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-3">✨</div>
          <h3 className="font-bold text-navy-900 mb-2">Strengths Analysis</h3>
          <p className="text-sm text-gray-600">Discover what makes your CV stand out to recruiters.</p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-3">💡</div>
          <h3 className="font-bold text-navy-900 mb-2">Improvement Tips</h3>
          <p className="text-sm text-gray-600">Get personalized recommendations to improve your CV.</p>
        </div>
      </div>
    </div>
  );
};

export default TryFree;
