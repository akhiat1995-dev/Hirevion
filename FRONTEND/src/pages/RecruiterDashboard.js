import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Users, Briefcase, AlertCircle, CheckCircle2, Trash2, Edit, TrendingUp, Award, BarChart3, History, Eye, Calendar, ChevronRight } from 'lucide-react';
import { submitHiringWorkflow, getStats, getJobs, deleteJob, getHiringSessions, getHiringSession, deleteHiringSession, clearHiringSessions, getApplications, clearApplications } from '../services/api';
import { PencilLoading, PencilProgressBar, PencilUnderline, StickyNote } from '../components/PencilDesigns';
import '../components/PencilDesigns.css';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [numberOfPositions, setNumberOfPositions] = useState(1);
  const [jobRequirements, setJobRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    fetchStats();
    fetchJobs();
    fetchSessions();
    fetchApplications();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      console.log('Could not fetch stats');
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      if (response.success) {
        setJobs(response.jobs || []);
      }
    } catch (err) {
      console.log('Could not fetch jobs');
    }
  };

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await getHiringSessions();
      if (response.success) {
        setSessions(response.sessions || []);
      }
    } catch (err) {
      console.log('Could not fetch sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const response = await getApplications();
      if (response.success) {
        setApplications(response.applications || []);
      }
    } catch (err) {
      console.log('Could not fetch applications');
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleClearApplications = async () => {
    if (window.confirm('Are you sure you want to clear all applications? This cannot be undone.')) {
      try {
        await clearApplications();
        fetchApplications();
        fetchStats();
      } catch (err) {
        console.error('Error clearing applications:', err);
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        fetchJobs();
        fetchStats();
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  const handleViewSession = async (sessionId) => {
    try {
      const response = await getHiringSession(sessionId);
      if (response.success) {
        navigate('/results', { state: { result: response.session } });
      }
    } catch (err) {
      console.error('Error viewing session:', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteHiringSession(sessionId);
        fetchSessions();
        fetchStats();
      } catch (err) {
        console.error('Error deleting session:', err);
      }
    }
  };

  const handleClearSessions = async () => {
    if (window.confirm('Are you sure you want to clear all sessions? This cannot be undone.')) {
      try {
        await clearHiringSessions();
        fetchSessions();
        fetchStats();
      } catch (err) {
        console.error('Error clearing sessions:', err);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    setFiles(prev => [...prev, ...pdfFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please upload at least one CV');
      return;
    }

    if (!jobTitle || !jobRequirements) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('job_title', jobTitle);
      formData.append('number_of_positions', numberOfPositions);
      formData.append('job_requirements', jobRequirements);
      files.forEach(file => {
        formData.append('cvs', file);
      });

      const result = await submitHiringWorkflow(formData);
      
      // Navigate to results page with the data
      navigate('/results', { state: { result } });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || '';
      
      // Check for rate limit error
      if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
        setError(
          '⚠️ AI Service Busy: We\'ve reached the daily analysis limit. ' +
          'Please try again in 10-15 minutes.'
        );
      } else {
        setError(errorMessage || 'An error occurred while processing your request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Overview</span>
          <span className="text-xs">/</span>
          <span className="text-navy-800 font-medium">Recruiter Dashboard</span>
        </div>
        <h1 className="font-serif text-4xl text-navy-900 font-bold">
          <PencilUnderline>Recruiter</PencilUnderline> Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Upload CVs, manage jobs, and let AI find the best matches.</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={<Users className="text-blue-600" size={20} />}
            label="Total CVs"
            value={stats.total_cvs || 0}
            color="blue"
          />
          <StatCard 
            icon={<Briefcase className="text-green-600" size={20} />}
            label="Jobs"
            value={stats.total_jobs || 0}
            color="green"
          />
          <StatCard 
            icon={<TrendingUp className="text-purple-600" size={20} />}
            label="Avg Score"
            value={`${stats.average_score || 0}%`}
            color="purple"
          />
          <StatCard 
            icon={<Award className="text-orange-600" size={20} />}
            label="Avg Experience"
            value={`${stats.average_experience_years || 0} yrs`}
            color="orange"
          />
        </div>
      )}

      {/* Top Skills Bar */}
      {stats?.top_skills?.length > 0 && (
        <div className="bg-white rounded-lg paper-shadow p-4 border border-warm-200 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="text-navy-800" size={18} />
            <h3 className="font-bold text-navy-900">Top Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.top_skills.slice(0, 8).map((item, idx) => (
              <span key={idx} className="px-3 py-1 bg-navy-50 text-navy-800 text-sm rounded border border-navy-100">
                {item.skill} <span className="text-gray-400">({item.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-warm-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'upload' 
              ? 'text-navy-800 border-b-2 border-navy-800' 
              : 'text-gray-500 hover:text-navy-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Upload size={18} />
            Upload CVs
          </span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'applications' 
              ? 'text-navy-800 border-b-2 border-navy-800' 
              : 'text-gray-500 hover:text-navy-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <History size={18} />
            Applications ({applications.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'jobs' 
              ? 'text-navy-800 border-b-2 border-navy-800' 
              : 'text-gray-500 hover:text-navy-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Briefcase size={18} />
            Jobs ({jobs.length})
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'applications' ? (
        <ApplicationsTab 
          applications={applications} 
          loading={loadingApplications} 
          onClear={handleClearApplications} 
        />
      ) : activeTab === 'jobs' ? (
        <JobsTab jobs={jobs} onDeleteJob={handleDeleteJob} />
      ) : (
        <UploadTab 
          files={files}
          setFiles={setFiles}
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          numberOfPositions={numberOfPositions}
          setNumberOfPositions={setNumberOfPositions}
          jobRequirements={jobRequirements}
          setJobRequirements={setJobRequirements}
          isLoading={isLoading}
          error={error}
          setError={setError}
          handleSubmit={handleSubmit}
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          removeFile={removeFile}
        />
      )}
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ icon, label, value, color }) => {
  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50'
  };
  
  return (
    <div className={`bg-white rounded-lg paper-shadow p-4 border border-warm-200`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-sm ${bgColors[color]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-serif font-bold text-navy-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

// Jobs Tab Component
const JobsTab = ({ jobs, onDeleteJob }) => {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200 text-center">
        <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="font-bold text-navy-900 mb-2">No Jobs Yet</h3>
        <p className="text-gray-500">Upload CVs and run an analysis to create jobs.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg paper-shadow border border-warm-200 overflow-hidden">
      <div className="p-4 border-b border-warm-200 bg-gray-50">
        <h2 className="font-serif text-xl font-bold text-navy-900">Your Job Postings</h2>
      </div>
      <div className="divide-y divide-warm-200">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 hover:bg-warm-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-navy-900">{job.title || job.job_title || 'Untitled Job'}</h3>
                <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-warm-50 rounded">
                    {job.positions || job.number_of_positions || 1} position(s)
                  </span>
                  {job.domain && (
                    <span className="px-2 py-1 bg-warm-50 rounded">{job.domain}</span>
                  )}
                  {job.seniority && (
                    <span className="px-2 py-1 bg-warm-50 rounded">{job.seniority}</span>
                  )}
                </div>
                {job.required_skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.required_skills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded">
                        {skill}
                      </span>
                    ))}
                    {job.required_skills.length > 5 && (
                      <span className="text-xs text-gray-400">+{job.required_skills.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onDeleteJob(job.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Delete job"
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

// Applications Tab Component
const ApplicationsTab = ({ applications, loading, onClear }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200 text-center">
        <div className="animate-spin mx-auto h-8 w-8 border-2 border-navy-800 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg paper-shadow p-8 border border-warm-200 text-center">
        <History className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="font-bold text-navy-900 mb-2">No Applications Yet</h3>
        <p className="text-gray-500">Upload CVs and run a hiring workflow to see applications here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg paper-shadow border border-warm-200 overflow-hidden">
      <div className="p-4 border-b border-warm-200 bg-gray-50 flex justify-between items-center">
        <h2 className="font-serif text-xl font-bold text-navy-900">
          Application History
          <span className="text-sm font-normal text-gray-500 ml-2">({applications.length} total)</span>
        </h2>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>
      <div className="divide-y divide-warm-200">
        {applications.map((app) => (
          <div key={app.id} className="p-4 hover:bg-warm-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="text-navy-800" size={18} />
                  <h3 className="font-bold text-navy-900">{app.candidate_name || app.filename || 'Unknown Candidate'}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                  {app.job_title && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {app.job_title}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-warm-50 rounded flex items-center gap-1">
                    <TrendingUp size={14} />
                    {app.experience_years || 0} years exp
                  </span>
                  <span className="px-2 py-1 bg-warm-50 rounded">
                    {app.skills?.length || 0} skills
                  </span>
                </div>
                {app.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {app.skills.slice(0, 6).map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded">
                        {skill}
                      </span>
                    ))}
                    {app.skills.length > 6 && (
                      <span className="text-xs text-gray-400">+{app.skills.length - 6} more</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-400">{app.status || 'analyzed'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Upload Tab Component
const UploadTab = ({ 
  files, jobTitle, setJobTitle, numberOfPositions, setNumberOfPositions,
  jobRequirements, setJobRequirements, isLoading, error, setError,
  handleSubmit, isDragActive, getRootProps, getInputProps, removeFile
}) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column - Job Details */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="text-navy-800" size={20} />
            <h2 className="font-serif text-xl font-bold text-navy-900">Job Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Full Stack Developer"
                className="w-full px-4 py-2 border border-warm-200 rounded-sm focus:ring-2 focus:ring-navy-800 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Positions <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={numberOfPositions}
                onChange={(e) => setNumberOfPositions(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-warm-200 rounded-sm focus:ring-2 focus:ring-navy-800 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                value={jobRequirements}
                onChange={(e) => setJobRequirements(e.target.value)}
                placeholder="Describe the role, required skills, experience level, and responsibilities..."
                rows={8}
                className="w-full px-4 py-2 border border-warm-200 rounded-sm focus:ring-2 focus:ring-navy-800 focus:border-transparent outline-none resize-none"
                required
              />
            </div>
          </div>
        </div>

        <StickyNote color="#E6FFFA">
          <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} />
            Tips for Better Results
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Be specific about required vs optional skills</li>
            <li>• Include years of experience needed</li>
            <li>• Mention key technologies/tools</li>
            <li>• Describe team size and structure</li>
          </ul>
        </StickyNote>
      </div>

      {/* Right Column - CV Upload */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-navy-800" size={20} />
            <h2 className="font-serif text-xl font-bold text-navy-900">Upload CVs</h2>
            <span className="text-sm text-gray-500 ml-auto">{files.length} file(s) selected</span>
          </div>

          <div
            {...getRootProps()}
            className={`upload-zone rounded-lg p-12 text-center cursor-pointer mb-6 ${
              isDragActive ? 'dragover border-navy-800 bg-navy-50' : ''
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-navy-800 font-medium">Drop the files here...</p>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  <span className="text-navy-800 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-400">PDF files only (max 10MB each)</p>
              </>
            )}
          </div>

          {files.length > 0 && (
            <div className="space-y-2 mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Selected Files:</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-warm-50 p-3 rounded-sm border border-warm-200">
                  <div className="flex items-center gap-3">
                    <FileText className="text-navy-800" size={20} />
                    <div>
                      <p className="font-medium text-navy-900 text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-red-50 rounded-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="py-4">
              <PencilLoading text="Analyzing CVs with AI..." />
              <div className="mt-4 space-y-3">
                <PencilProgressBar progress={30} label="Parsing CV documents..." />
                <PencilProgressBar progress={15} label="Extracting skills and experience..." />
              </div>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={files.length === 0}
              className={`w-full py-4 rounded-sm font-medium flex items-center justify-center gap-2 transition-all ${
                files.length === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-navy-800 text-white hover:bg-navy-900 shadow-md hover:shadow-lg'
              }`}
            >
              <Users size={20} />
              Analyze {files.length} CV{files.length !== 1 ? 's' : ''}
            </button>
          )}

          {files.length === 0 && !isLoading && (
            <p className="text-center text-sm text-gray-400 mt-3">
              Upload at least one CV to start analysis
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
