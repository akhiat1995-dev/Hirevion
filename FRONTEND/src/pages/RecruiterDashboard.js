import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Users, Briefcase, AlertCircle, CheckCircle2, Trash2, TrendingUp, Award, Calendar, ChevronRight, Eye, Star, UserX, Download, Search, Plus, ChevronDown, ChevronUp, StickyNote as StickyNoteIcon, BarChart3, Clock, Target, CheckCircle, Zap, AlertTriangle, Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { submitHiringWorkflow, getStats, getHiringSessions, getHiringSession, deleteHiringSession, clearHiringSessions, getApplications } from '../services/api';
import api from '../services/api';
import { PencilLoading, PencilProgressBar, PencilUnderline, StickyNote } from '../components/PencilDesigns';
import '../components/PencilDesigns.css';
import '../components/PrintStyles.css';

// ====== REUSABLE UI COMPONENTS ======
const ScoreBadge = ({ score, size = 'md' }) => {
  const colors = score >= 80 ? 'text-green-700 bg-green-50' : score >= 60 ? 'text-blue-700 bg-blue-50' : score >= 40 ? 'text-orange-700 bg-orange-50' : 'text-red-700 bg-red-50';
  const sizes = { sm: 'text-sm px-2 py-0.5', md: 'text-base px-3 py-1', lg: 'text-2xl px-4 py-2' };
  return <span className={`font-bold rounded-lg ${colors} ${sizes[size]}`}>{score}%</span>;
};

const StatusBadge = ({ tier }) => {
  const styles = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    potential: 'bg-orange-100 text-orange-800',
    not_suitable: 'bg-red-100 text-red-800'
  };
  const labels = { excellent: 'Excellent', good: 'Good', potential: 'Potential', not_suitable: 'Not Suitable' };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[tier] || styles.not_suitable}`}>{labels[tier] || tier}</span>;
};

const SkillTag = ({ skill, variant = 'default' }) => {
  const styles = {
    matched: 'bg-green-50 text-green-700 border border-green-200',
    missing: 'bg-red-50 text-red-700 border border-red-200',
    transferable: 'bg-orange-50 text-orange-700 border border-orange-200',
    default: 'bg-gray-50 text-gray-700 border border-gray-200'
  };
  return <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${styles[variant]}`}>{skill}</span>;
};

const ProgressBar = ({ label, score, color = 'blue' }) => {
  const colors = { blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500', orange: 'bg-orange-500', red: 'bg-red-500', indigo: 'bg-indigo-500' };
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center"><span className="text-xs font-medium text-gray-600">{label}</span><span className="text-xs font-bold text-gray-900">{score}%</span></div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full ${colors[color]}`} style={{ width: `${Math.min(score, 100)}%` }}></div></div>
    </div>
  );
};

const KPICard = ({ label, value, icon: Icon, color = 'blue' }) => {
  const colors = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', red: 'bg-red-50 text-red-600', purple: 'bg-purple-50 text-purple-600' };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}><Icon size={16} /></div><span className="text-xs font-medium text-gray-500">{label}</span></div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
  </div>
);

const CandidateCard = ({ candidate, rank, type = 'approved' }) => {
  const details = candidate.matching_details || {};
  const skills = candidate.skills_analysis || {};
  const exp = candidate.experience_analysis || {};
  const edu = candidate.education_analysis || {};
  const seniority = candidate.seniority_analysis || {};
  const softSkills = candidate.soft_skills_analysis || {};
  const growth = candidate.growth_analysis || {};
  const domain = candidate.domain_analysis || {};
  const isApproved = type === 'approved';

  return (
    <div className={`rounded-xl border overflow-hidden ${isApproved ? 'border-green-200 bg-white' : 'border-red-200 bg-white'}`}>
      {/* Card Header */}
      <div className={`px-5 py-4 border-b ${isApproved ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {rank && <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' : rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gradient-to-br from-navy-600 to-navy-800'}`}>#{rank}</div>}
            <div>
              <h3 className="font-semibold text-gray-900">{candidate.candidate_name || 'Unknown'}</h3>
              <p className="text-xs text-gray-500">{candidate.filename || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge tier={details.tier} />
            <ScoreBadge score={details.overall_score} size="lg" />
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Score Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <ProgressBar label="Skills" score={details.breakdown?.skills_score || 0} color="blue" />
          <ProgressBar label="Experience" score={details.breakdown?.experience_score || 0} color="green" />
          <ProgressBar label="Education" score={details.breakdown?.education_score || 0} color="purple" />
          <ProgressBar label="Soft Skills" score={details.breakdown?.soft_skills_score || 0} color="orange" />
          <ProgressBar label="Growth" score={details.breakdown?.growth_score || 0} color="indigo" />
        </div>
      </div>

      {/* Skills Matching */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Skills Matching</h4>
        <div className="space-y-3">
          {skills.required_matched?.length > 0 && (
            <div><p className="text-xs font-medium text-green-600 mb-1.5 flex items-center gap-1"><CheckCircle size={12} /> Matched Skills</p><div className="flex flex-wrap gap-1.5">{skills.required_matched.map((s, i) => (<SkillTag key={i} skill={s} variant="matched" />))}</div></div>
          )}
          {skills.required_missing?.length > 0 && (
            <div><p className="text-xs font-medium text-red-600 mb-1.5 flex items-center gap-1"><AlertTriangle size={12} /> Missing Skills</p><div className="flex flex-wrap gap-1.5">{skills.required_missing.map((s, i) => (<SkillTag key={i} skill={s} variant="missing" />))}</div></div>
          )}
          {skills.similar_skills?.length > 0 && (
            <div><p className="text-xs font-medium text-orange-600 mb-1.5 flex items-center gap-1"><ArrowUpRight size={12} /> Transferable Skills</p><div className="flex flex-wrap gap-1.5">{skills.similar_skills.map((s, i) => (<SkillTag key={i} skill={`${s.required} → ${s.found}`} variant="transferable" />))}</div></div>
          )}
        </div>
      </div>

      {/* Experience & Education */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Experience</h4>
            <div className="space-y-1.5">
              <DetailRow label="Years" value={`${exp.candidate_years || 0} years${exp.required_years ? ` / ${exp.required_years} required` : ''}`} />
              {exp.industry_alignment && <DetailRow label="Industry" value={<span className="capitalize">{exp.industry_alignment}</span>} />}
            </div>
            {exp.notable_achievements?.length > 0 && (
              <div className="mt-2"><p className="text-xs font-medium text-gray-500 mb-1">Achievements</p><ul className="text-xs text-gray-700 space-y-0.5">{exp.notable_achievements.map((a, i) => (<li key={i} className="flex items-start gap-1.5"><CheckCircle size={10} className="text-green-500 mt-0.5 flex-shrink-0" />{a}</li>))}</ul></div>
            )}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Education</h4>
            <div className="space-y-1.5">
              <DetailRow label="Required" value={edu.required} />
              <DetailRow label="Candidate" value={edu.candidate} />
            </div>
            {edu.relevant_certifications?.length > 0 && (
              <div className="mt-2"><p className="text-xs font-medium text-gray-500 mb-1">Certifications</p><div className="flex flex-wrap gap-1">{edu.relevant_certifications.map((c, i) => (<span key={i} className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-200">{c}</span>))}</div></div>
            )}
          </div>
        </div>
      </div>

      {/* Soft Skills & Growth */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="grid md:grid-cols-2 gap-4">
          {softSkills.detected?.length > 0 && (
            <div><h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Soft Skills</h4><div className="flex flex-wrap gap-1.5">{softSkills.detected.map((s, i) => (<span key={i} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">{s}</span>))}</div>{softSkills.red_flags?.length > 0 && softSkills.red_flags[0] !== 'None detected' && <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertTriangle size={10} />{softSkills.red_flags.join(', ')}</p>}</div>
          )}
          {growth.career_progression && (
            <div><h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Growth Potential</h4><p className="text-xs text-gray-700">{growth.career_progression}</p><p className="text-xs text-gray-500 mt-1">Learning: <span className="font-medium capitalize">{growth.learning_trajectory}</span></p></div>
          )}
        </div>
      </div>

      {/* Commentary & Interview Questions */}
      <div className="px-5 py-4">
        {candidate.recruiter_commentary && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Recruiter Commentary</h4>
            <p className="text-xs text-gray-700 leading-relaxed">{candidate.recruiter_commentary}</p>
          </div>
        )}
        {candidate.recommended_interview_questions?.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Recommended Interview Questions</h4>
            <ol className="text-xs text-gray-700 space-y-1.5">{candidate.recommended_interview_questions.map((q, i) => (<li key={i} className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>{q}</li>))}</ol>
          </div>
        )}
      </div>
    </div>
  );
};

const RejectedCandidateCard = ({ candidate }) => {
  const details = candidate.matching_details || {};
  const skills = candidate.skills_analysis || {};

  return (
    <div className="rounded-xl border border-red-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
        <div><h3 className="font-medium text-gray-900 text-sm">{candidate.candidate_name || 'Unknown'}</h3><p className="text-xs text-gray-500">{candidate.filename || ''}</p></div>
        <ScoreBadge score={details.overall_score} size="sm" />
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-5 gap-2 mb-3">
          <ProgressBar label="Skills" score={details.breakdown?.skills_score || 0} color="blue" />
          <ProgressBar label="Exp" score={details.breakdown?.experience_score || 0} color="green" />
          <ProgressBar label="Edu" score={details.breakdown?.education_score || 0} color="purple" />
          <ProgressBar label="Soft" score={details.breakdown?.soft_skills_score || 0} color="orange" />
          <ProgressBar label="Growth" score={details.breakdown?.growth_score || 0} color="indigo" />
        </div>
        {skills.required_missing?.length > 0 && (
          <div className="mb-2"><p className="text-xs font-medium text-red-600 mb-1">Missing Skills</p><div className="flex flex-wrap gap-1">{skills.required_missing.map((s, i) => (<SkillTag key={i} skill={s} variant="missing" />))}</div></div>
        )}
        {candidate.rejection_reason && <p className="text-xs text-gray-600 mt-2">Reason: {candidate.rejection_reason}</p>}
        {candidate.recommended_interview_questions?.length > 0 && (
          <div className="mt-2 p-2 bg-gray-50 rounded"><p className="text-xs font-medium text-gray-500 mb-1">If Reconsidered:</p><ol className="text-xs text-gray-700 list-decimal list-inside">{candidate.recommended_interview_questions.map((q, i) => (<li key={i}>{q}</li>))}</ol></div>
        )}
      </div>
    </div>
  );
};

// ====== MAIN COMPONENT ======
const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [numberOfPositions, setNumberOfPositions] = useState(1);
  const [jobRequirements, setJobRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const printRef = useRef(null);

  useEffect(() => { fetchStats(); fetchSessions(); }, []);

  const fetchStats = async () => { try { const r = await getStats(); if (r.success) setStats(r.stats); } catch (e) {} };
  const fetchSessions = async () => { setLoadingSessions(true); try { const r = await getHiringSessions(); if (r.success) setSessions(r.sessions || []); } catch (e) {} finally { setLoadingSessions(false); } };

  const handleViewSession = async (sessionId) => { setLoadingSession(true); try { const r = await getHiringSession(sessionId); if (r.success) setSelectedSession(r.session); } catch (e) {} finally { setLoadingSession(false); } };
  const handleDeleteSession = async (sessionId) => { if (window.confirm('Delete this screening and all its data?')) { try { await deleteHiringSession(sessionId); fetchSessions(); fetchStats(); if (selectedSession?.id === sessionId) setSelectedSession(null); } catch (e) {} } };
  const handleClearAll = async () => { if (window.confirm('Delete ALL screenings and data?')) { try { await clearHiringSessions(); setSessions([]); setSelectedSession(null); fetchStats(); } catch (e) {} } };

  const handleExportPDF = async (sessionData) => {
    const printEl = document.getElementById('session-detail-print');
    const screenEl = document.getElementById('session-detail');
    if (printEl) printEl.style.display = 'block';
    if (screenEl) screenEl.style.display = 'none';
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        if (printEl) printEl.style.display = 'none';
        if (screenEl) screenEl.style.display = 'block';
      }, 500);
    }, 200);
  };

  const formatDate = (dateStr) => { if (!dateStr) return 'N/A'; return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };

  const onDrop = useCallback((acceptedFiles) => { setFiles(prev => [...prev, ...acceptedFiles.filter(f => f.type === 'application/pdf')]); }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: true });
  const removeFile = (index) => { setFiles(prev => prev.filter((_, i) => i !== index)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) { setError('Please upload at least one CV'); return; }
    if (!jobTitle || !jobRequirements) { setError('Please fill in all fields'); return; }
    setIsLoading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append('job_title', jobTitle); formData.append('number_of_positions', numberOfPositions);
      formData.append('job_requirements', jobRequirements);
      files.forEach(file => formData.append('cvs', file));
      const result = await submitHiringWorkflow(formData);
      navigate('/results', { state: { result } });
    } catch (err) { const msg = err.response?.data?.detail || ''; setError(msg.includes('429') ? 'AI Service Busy. Try again in 10-15 minutes.' : (msg || 'Error occurred.')); }
    finally { setIsLoading(false); }
  };

  const filteredSessions = searchTerm ? sessions.filter(s => (s.job_title || '').toLowerCase().includes(searchTerm.toLowerCase())) : sessions;
  const totalApproved = sessions.reduce((s, j) => s + (j.approved_count || 0), 0);
  const totalRejected = sessions.reduce((s, j) => s + (j.rejected_count || 0), 0);
  const totalCVs = sessions.reduce((s, j) => s + (j.total_candidates || 0), 0);

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 no-print">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2"><span>Dashboard</span><span className="text-xs">/</span><span className="text-gray-700 font-medium">Hiring Management</span></div>
        <h1 className="text-2xl font-bold text-gray-900">Hiring Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage job postings, screen candidates, and track hiring progress.</p>
      </div>

      {/* Stats Bar */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6 no-print">
          <KPICard label="Total Screenings" value={sessions.length} icon={Calendar} color="blue" />
          <KPICard label="CVs Screened" value={totalCVs} icon={Users} color="green" />
          <KPICard label="Approved" value={totalApproved} icon={CheckCircle2} color="purple" />
          <KPICard label="Rejected" value={totalRejected} icon={UserX} color="red" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 no-print">
        <button onClick={() => { setActiveTab('history'); setSelectedSession(null); }} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><span className="flex items-center gap-2"><BarChart3 size={16} />Hiring History</span></button>
        <button onClick={() => { setActiveTab('upload'); setSelectedSession(null); }} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upload' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><span className="flex items-center gap-2"><Plus size={16} />New Screening</span></button>
      </div>

      {activeTab === 'history' && (
        <HistoryTab sessions={filteredSessions} allSessions={sessions} loading={loadingSessions} selectedSession={selectedSession} loadingSession={loadingSession} onViewSession={handleViewSession} onDeleteSession={handleDeleteSession} onClearAll={handleClearAll} onExportPDF={handleExportPDF} formatDate={formatDate} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      {activeTab === 'upload' && (
        <UploadTab files={files} setFiles={setFiles} jobTitle={jobTitle} setJobTitle={setJobTitle} numberOfPositions={numberOfPositions} setNumberOfPositions={setNumberOfPositions} jobRequirements={jobRequirements} setJobRequirements={setJobRequirements} isLoading={isLoading} error={error} setError={setError} handleSubmit={handleSubmit} isDragActive={isDragActive} getRootProps={getRootProps} getInputProps={getInputProps} removeFile={removeFile} />
      )}
    </div>
  );
};

// ====== HISTORY TAB ======
const HistoryTab = ({ sessions, allSessions, loading, selectedSession, loadingSession, onViewSession, onDeleteSession, onClearAll, onExportPDF, formatDate, searchTerm, setSearchTerm }) => {
  if (selectedSession) return <SessionDetailView session={selectedSession} onBack={() => onViewSession(null)} onDelete={onDeleteSession} onExportPDF={onExportPDF} formatDate={formatDate} />;
  if (loading) return <div className="bg-white border border-gray-200 rounded-xl p-8 text-center"><div className="animate-spin mx-auto h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full mb-4"></div><p className="text-gray-500 text-sm">Loading history...</p></div>;
  if (sessions.length === 0) return (<div className="bg-white border border-gray-200 rounded-xl p-12 text-center"><Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" /><h3 className="font-semibold text-gray-900 mb-2">No Hiring History</h3><p className="text-sm text-gray-500 max-w-md mx-auto">Create your first screening to start tracking candidates.</p></div>);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 no-print">
        <div className="relative w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search screenings..." className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" /></div>
        <button onClick={onClearAll} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"><Trash2 size={14} /> Clear All</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Positions</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total CVs</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rejected</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Briefcase size={16} className="text-blue-600" /></div><div><p className="font-medium text-gray-900 text-sm">{session.job_title || 'Untitled'}</p></div></div></td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{session.number_of_positions || 1}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{session.total_candidates || 0}</td>
                <td className="px-4 py-3 text-center"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{session.approved_count || 0}</span></td>
                <td className="px-4 py-3 text-center"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{session.rejected_count || 0}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(session.created_at)}</td>
                <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                  <button onClick={() => onViewSession(session.id)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="View"><Eye size={16} /></button>
                  <button onClick={() => onExportPDF(session)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Export PDF"><Download size={16} /></button>
                  <button onClick={() => onDeleteSession(session.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ====== SESSION DETAIL VIEW ======
const SessionDetailView = ({ session, onBack, onDelete, onExportPDF, formatDate }) => {
  const approved = session.approved_candidates || [];
  const rejected = session.rejected_candidates || [];
  const summary = session.selection_summary || {};
  const jobSummary = session.job_summary || {};
  const [sessionNote, setSessionNote] = useState(session.session_note || '');
  const [savingNote, setSavingNote] = useState(false);

  const handleSaveSessionNote = async () => { setSavingNote(true); try { await api.put(`/recruiter/sessions/${session.id}/notes`, { session_note: sessionNote.trim() }); } catch (e) {} finally { setSavingNote(false); } };

  return (
    <>
      {/* Action Bar - Screen Only */}
      <div className="flex items-center justify-between mb-6 no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"><ChevronRight className="rotate-180" size={16} /> Back to History</button>
        <div className="flex gap-3">
          <button onClick={() => onExportPDF(session)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"><Download size={16} /> Export PDF Report</button>
          <button onClick={() => onDelete(session.id)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all text-sm font-medium"><Trash2 size={16} /> Delete</button>
        </div>
      </div>

      {/* ===== SCREEN VIEW ===== */}
      <div className="space-y-6 no-print" id="session-detail">
        {/* PROFESSIONAL HEADER */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center"><Briefcase size={20} className="text-gray-900" /></div>
              <div><h1 className="text-xl font-bold tracking-wide">HIREVION</h1><p className="text-xs text-gray-400">AI-Powered Hiring Report</p></div>
            </div>
            <div className="text-right"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">Completed</span><p className="text-xs text-gray-400 mt-1">{formatDate(session.created_at)}</p></div>
          </div>
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Reference</p><p className="text-sm font-medium text-gray-900">HR-{session.id?.slice(0, 8) || 'N/A'}</p></div>
              <div><p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Position</p><p className="text-sm font-medium text-gray-900">{session.job_title || 'Not specified'}</p></div>
              <div><p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Prepared For</p><p className="text-sm font-medium text-gray-900">{(() => { try { return JSON.parse(localStorage.getItem('user') || '{}').full_name || 'Recruiter'; } catch { return 'Recruiter'; } })()}</p></div>
              <div><p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Generated</p><p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div>
            </div>
          </div>
          <div className="px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Briefcase size={14} className="text-gray-500" /> Job Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-white border border-gray-200 rounded-lg"><p className="text-[10px] font-medium text-gray-500 mb-1">Positions Available</p><p className="text-lg font-bold text-gray-900">{session.number_of_positions || 1}</p></div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg"><p className="text-[10px] font-medium text-gray-500 mb-1">Domain</p><p className="text-sm font-medium text-gray-900">{jobSummary.domain || 'Not specified'}</p></div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg"><p className="text-[10px] font-medium text-gray-500 mb-1">Seniority Level</p><p className="text-sm font-medium text-gray-900">{jobSummary.seniority || 'Not specified'}</p></div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg"><p className="text-[10px] font-medium text-gray-500 mb-1">Required Skills</p><p className="text-lg font-bold text-gray-900">{jobSummary.required_skills?.length || 0}</p></div>
            </div>
            {jobSummary.required_skills?.length > 0 && (<div className="mt-3"><p className="text-[10px] font-medium text-gray-500 mb-1.5">Required Skills List</p><div className="flex flex-wrap gap-1.5">{jobSummary.required_skills.map((s, i) => (<SkillTag key={i} skill={s} variant="default" />))}</div></div>)}
            {jobSummary.optional_skills?.length > 0 && (<div className="mt-2"><p className="text-[10px] font-medium text-gray-500 mb-1.5">Preferred Skills</p><div className="flex flex-wrap gap-1.5">{jobSummary.optional_skills.map((s, i) => (<span key={i} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">{s}</span>))}</div></div>)}
            {jobSummary.experience_required && (<div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg"><p className="text-[10px] font-medium text-gray-500 mb-0.5">Experience Required</p><p className="text-xs text-gray-700">{jobSummary.experience_required.description || `${jobSummary.experience_required.min_years || 0}-${jobSummary.experience_required.max_years || 0} years`}</p></div>)}
          </div>
        </div>

        {/* EXECUTIVE SUMMARY */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><BarChart3 size={14} className="text-gray-500" /> Executive Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard label="Total CVs Screened" value={summary.total_candidates || 0} icon={FileText} color="blue" />
            <KPICard label="Approved Candidates" value={summary.approved_count || 0} icon={CheckCircle2} color="green" />
            <KPICard label="Rejected Candidates" value={summary.rejected_count || 0} icon={UserX} color="red" />
            <KPICard label="Approval Rate" value={`${summary.approved_count > 0 ? Math.round((summary.approved_count / (summary.total_candidates || 1)) * 100) : 0}%`} icon={TrendingUp} color="purple" />
          </div>
          {summary.tier_distribution && (<div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg"><p className="text-[10px] font-medium text-gray-500 mb-2">Tier Distribution</p><div className="flex gap-4"><span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>Excellent: {summary.tier_distribution.excellent || 0}</span><span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Good: {summary.tier_distribution.good || 0}</span><span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1"></span>Potential: {summary.tier_distribution.potential || 0}</span><span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>Not Suitable: {summary.tier_distribution.not_suitable || 0}</span></div></div>)}
        </div>

        {/* APPROVED CANDIDATES */}
        {approved.length > 0 && (<div><div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-600" /> Approved Candidates</h2><span className="text-xs text-gray-500">{approved.length} candidate{approved.length > 1 ? 's' : ''} selected</span></div><div className="space-y-4">{approved.map((c, i) => (<CandidateCard key={c.cv_id || i} candidate={c} rank={c.rank || i + 1} type="approved" />))}</div></div>)}

        {/* REJECTED CANDIDATES */}
        {rejected.length > 0 && (<div><div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><UserX size={14} className="text-red-600" /> Rejected Candidates</h2><span className="text-xs text-gray-500">{rejected.length} candidate{rejected.length > 1 ? 's' : ''} not selected</span></div><div className="grid md:grid-cols-2 gap-4">{rejected.map((c, i) => (<RejectedCandidateCard key={c.cv_id || i} candidate={c} />))}</div></div>)}

        {/* SESSION NOTES */}
        <div className="bg-white border border-gray-200 rounded-xl p-5"><h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><StickyNoteIcon size={14} className="text-yellow-600" /> Session Notes</h3><textarea value={sessionNote} onChange={(e) => setSessionNote(e.target.value)} onBlur={handleSaveSessionNote} placeholder="Add notes about this hiring session..." rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none" />{savingNote && <span className="text-xs text-gray-400 mt-1">Saving...</span>}{sessionNote && !savingNote && <span className="text-xs text-green-600 mt-1">✓ Note saved</span>}</div>

        {/* RECOMMENDATIONS */}
        {session.hiring_recommendations?.length > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-xl p-5"><h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2"><Award size={14} className="text-blue-600" /> Hiring Recommendations</h3><ul className="space-y-2">{session.hiring_recommendations.map((rec, i) => (<li key={i} className="text-sm text-blue-800 flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>{rec}</li>))}</ul></div>)}

        {/* SIGNATURE AREA */}
        <div className="mt-8 pt-6 border-t-2 border-gray-300"><div className="grid grid-cols-2 gap-12"><div><p className="text-sm font-medium text-gray-500 mb-8">Recruiter Signature</p><div className="border-b border-gray-400 pb-2"></div><p className="text-xs text-gray-400 mt-2">Name: _______________</p><p className="text-xs text-gray-400">Date: _______________</p></div><div><p className="text-sm font-medium text-gray-500 mb-8">Hiring Manager Signature</p><div className="border-b border-gray-400 pb-2"></div><p className="text-xs text-gray-400 mt-2">Name: _______________</p><p className="text-xs text-gray-400">Date: _______________</p></div></div></div>
      </div>

      {/* ===== PRINT-ONLY PROFESSIONAL DOCUMENT ===== */}
      <div id="session-detail-print" style={{ display: 'none', fontFamily: "'Times New Roman', Georgia, serif", color: '#000', lineHeight: '1.3', fontSize: '9pt', maxWidth: '100%', margin: '0 auto', padding: '0' }}>
        {/* ===== DOCUMENT HEADER - CENTERED ===== */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '22pt', fontWeight: '700', letterSpacing: '6px', color: '#000', marginBottom: '2px' }}>HIREVION</div>
          <div style={{ fontSize: '10pt', color: '#333', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>Candidat Assessment Report</div>
          <div style={{ fontSize: '8pt', color: '#666' }}>AI-Powered Recruitment Platform</div>
        </div>

        {/* Document Meta */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', width: '15%', background: '#f5f5f5' }}>Reference</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '9pt', width: '35%' }}>HR-{session.id?.slice(0, 8) || 'N/A'}</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', width: '15%', background: '#f5f5f5' }}>Date</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '9pt', width: '35%' }}>{formatDate(session.created_at)}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', background: '#f5f5f5' }}>Position</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '9pt', fontWeight: '600' }} colSpan="3">{session.job_title || 'Not specified'}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', fontSize: '8pt', fontWeight: '600', background: '#f5f5f5' }}>Prepared By</td>
              <td style={{ padding: '4px 8px', fontSize: '9pt' }} colSpan="3">{(() => { try { return JSON.parse(localStorage.getItem('user') || '{}').full_name || 'Recruiter'; } catch { return 'Recruiter'; } })()}</td>
            </tr>
          </tbody>
        </table>

        {/* ===== SECTION 1: POSITION DETAILS ===== */}
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: '700', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>1. Position Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6px', border: '1px solid #ccc' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', width: '18%', background: '#f5f5f5' }}>Openings</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '9pt', width: '18%' }}>{session.number_of_positions || 1}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', width: '18%', background: '#f5f5f5' }}>Domain</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '9pt', width: '18%' }}>{jobSummary.domain || 'Not specified'}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', width: '14%', background: '#f5f5f5' }}>Seniority</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '9pt', textTransform: 'capitalize' }}>{jobSummary.seniority || 'Not specified'}</td>
              </tr>
              {jobSummary.experience_required && (
                <tr>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', background: '#f5f5f5' }}>Experience</td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '9pt' }} colSpan="5">{jobSummary.experience_required.description || `${jobSummary.experience_required.min_years || 0}–${jobSummary.experience_required.max_years || 0} years`}</td>
                </tr>
              )}
            </tbody>
          </table>
          {jobSummary.required_skills?.length > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '8pt', fontWeight: '600' }}>Required Skills: </span>
              <span style={{ fontSize: '8pt' }}>{jobSummary.required_skills.join(', ')}</span>
            </div>
          )}
          {jobSummary.optional_skills?.length > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '8pt', fontWeight: '600' }}>Preferred Skills: </span>
              <span style={{ fontSize: '8pt' }}>{jobSummary.optional_skills.join(', ')}</span>
            </div>
          )}
          {session.job_requirements && (
            <div style={{ fontSize: '8pt', lineHeight: '1.4' }}>
              <span style={{ fontWeight: '600' }}>Requirements: </span>
              <span>{session.job_requirements}</span>
            </div>
          )}
        </div>

        {/* ===== SECTION 2: EXECUTIVE SUMMARY ===== */}
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: '700', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>2. Executive Summary</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6px', border: '1px solid #ccc' }}>
            <tbody>
              <tr>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center', width: '20%', background: '#f5f5f5' }}>Total Screened</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '14pt', fontWeight: '700', textAlign: 'center', width: '13%' }}>{summary.total_candidates || 0}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center', width: '20%', background: '#f5f5f5' }}>Approved</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '14pt', fontWeight: '700', textAlign: 'center', width: '13%' }}>{summary.approved_count || 0}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center', width: '20%', background: '#f5f5f5' }}>Rejected</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '14pt', fontWeight: '700', textAlign: 'center', width: '13%' }}>{summary.rejected_count || 0}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center', background: '#f5f5f5' }}>Approval Rate</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '14pt', fontWeight: '700', textAlign: 'center' }}>{summary.approved_count > 0 ? Math.round((summary.approved_count / (summary.total_candidates || 1)) * 100) : 0}%</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center', background: '#f5f5f5' }}>Method</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', textAlign: 'center' }} colSpan="3">AI Multi-Criteria Analysis</td>
              </tr>
            </tbody>
          </table>
          {summary.tier_distribution && (
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center', width: '25%', background: '#f5f5f5' }}>Excellent (80%+)</td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '12pt', fontWeight: '700', textAlign: 'center', width: '8%' }}>{summary.tier_distribution.excellent || 0}</td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center', width: '25%', background: '#f5f5f5' }}>Good (60-79%)</td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '12pt', fontWeight: '700', textAlign: 'center', width: '8%' }}>{summary.tier_distribution.good || 0}</td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center', width: '25%', background: '#f5f5f5' }}>Potential (40-59%)</td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #ccc', fontSize: '12pt', fontWeight: '700', textAlign: 'center', width: '8%' }}>{summary.tier_distribution.potential || 0}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 8px', fontSize: '8pt', fontWeight: '600', textAlign: 'center', background: '#f5f5f5' }}>Not Suitable (&lt;40%)</td>
                  <td style={{ padding: '4px 8px', fontSize: '12pt', fontWeight: '700', textAlign: 'center' }}>{summary.tier_distribution.not_suitable || 0}</td>
                  <td style={{ padding: '4px 8px', fontSize: '8pt', fontWeight: '600', textAlign: 'center', background: '#f5f5f5' }}>Total</td>
                  <td style={{ padding: '4px 8px', fontSize: '12pt', fontWeight: '700', textAlign: 'center' }} colSpan="3">{summary.total_candidates || 0}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* ===== SECTION 3: APPROVED CANDIDATES ===== */}
        {approved.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: '700', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>3. Approved Candidates ({approved.length})</h2>
            {approved.map((c, i) => {
              const details = c.matching_details || {};
              const skills = c.skills_analysis || {};
              const exp = c.experience_analysis || {};
              const edu = c.education_analysis || {};
              const softSkills = c.soft_skills_analysis || {};
              const growth = c.growth_analysis || {};
              const domain = c.domain_analysis || {};
              const seniority = c.seniority_analysis || {};
              return (
                <div key={c.cv_id || i} style={{ border: '1px solid #ccc', marginBottom: '10px', pageBreakInside: 'avoid' }}>
                  {/* Candidate Header */}
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', background: '#f0f0f0', width: '5%' }}>
                          <span style={{ fontSize: '10pt', fontWeight: '700' }}>#{c.rank || i + 1}</span>
                        </td>
                        <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', background: '#f0f0f0' }}>
                          <div style={{ fontSize: '10pt', fontWeight: '700' }}>{c.candidate_name || 'Unknown'}</div>
                          <div style={{ fontSize: '7pt', color: '#555' }}>{c.filename || ''}</div>
                        </td>
                        <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', background: '#f0f0f0', textAlign: 'center', width: '10%' }}>
                          <div style={{ fontSize: '6pt', fontWeight: '600', color: '#555' }}>OVERALL</div>
                          <div style={{ fontSize: '16pt', fontWeight: '700' }}>{details.overall_score || 0}%</div>
                        </td>
                        <td style={{ padding: '5px 8px', borderBottom: '1px solid #ccc', background: '#f0f0f0', textAlign: 'center', width: '10%' }}>
                          <div style={{ fontSize: '6pt', fontWeight: '600', color: '#555' }}>TIER</div>
                          <div style={{ fontSize: '9pt', fontWeight: '600', textTransform: 'capitalize' }}>{details.tier || 'N/A'}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Score Breakdown */}
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', textAlign: 'center', width: '20%', background: '#f5f5f5' }}>Skills</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '10pt', fontWeight: '700', textAlign: 'center', width: '10%' }}>{details.breakdown?.skills_score || 0}%</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', textAlign: 'center', width: '20%', background: '#f5f5f5' }}>Experience</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '10pt', fontWeight: '700', textAlign: 'center', width: '10%' }}>{details.breakdown?.experience_score || 0}%</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', textAlign: 'center', width: '20%', background: '#f5f5f5' }}>Education</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '10pt', fontWeight: '700', textAlign: 'center', width: '10%' }}>{details.breakdown?.education_score || 0}%</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', textAlign: 'center', width: '20%', background: '#f5f5f5' }}>Soft Skills</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '10pt', fontWeight: '700', textAlign: 'center', width: '10%' }}>{details.breakdown?.soft_skills_score || 0}%</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', textAlign: 'center', background: '#f5f5f5' }}>Growth</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '10pt', fontWeight: '700', textAlign: 'center' }} colSpan="7">{details.breakdown?.growth_score || 0}%</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Skills */}
                  {(skills.required_matched?.length > 0 || skills.required_missing?.length > 0 || skills.similar_skills?.length > 0) && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {skills.required_matched?.length > 0 && (
                          <tr><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', width: '15%', background: '#f5f5f5' }}>Matched</td><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', lineHeight: '1.4' }} colSpan="7">{skills.required_matched.join(', ')}</td></tr>
                        )}
                        {skills.required_missing?.length > 0 && (
                          <tr><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', background: '#f5f5f5' }}>Missing</td><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', lineHeight: '1.4' }} colSpan="7">{skills.required_missing.join(', ')}</td></tr>
                        )}
                        {skills.similar_skills?.length > 0 && (
                          <tr><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', background: '#f5f5f5' }}>Transferable</td><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', lineHeight: '1.4' }} colSpan="7">{skills.similar_skills.map(s => `${s.required} → ${s.found}`).join('; ')}</td></tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Background */}
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', width: '15%', background: '#f5f5f5' }}>Experience</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', width: '20%' }}>{exp.candidate_years || 0} years{exp.required_years ? ` / ${exp.required_years} req` : ''}</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', width: '10%', background: '#f5f5f5' }}>Industry</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', width: '20%', textTransform: 'capitalize' }}>{exp.industry_alignment || 'N/A'}</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', width: '10%', background: '#f5f5f5' }}>Education</td>
                        <td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', width: '25%' }}>{edu.candidate || 'N/A'}</td>
                      </tr>
                      {edu.relevant_certifications?.length > 0 && (
                        <tr><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', background: '#f5f5f5' }}>Certifications</td><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt' }} colSpan="5">{edu.relevant_certifications.join(', ')}</td></tr>
                      )}
                      {exp.notable_achievements?.length > 0 && (
                        <tr><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', background: '#f5f5f5' }}>Achievements</td><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', lineHeight: '1.4' }} colSpan="5">{exp.notable_achievements.join('; ')}</td></tr>
                      )}
                      {softSkills.detected?.length > 0 && (
                        <tr><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', background: '#f5f5f5' }}>Soft Skills</td><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt' }} colSpan="5">{softSkills.detected.join(', ')}</td></tr>
                      )}
                      {growth.career_progression && (
                        <tr><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', background: '#f5f5f5' }}>Progression</td><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt', lineHeight: '1.4' }} colSpan="5">{growth.career_progression}</td></tr>
                      )}
                      {domain.domain_fit && (
                        <tr><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '7pt', fontWeight: '600', background: '#f5f5f5' }}>Domain Fit</td><td style={{ padding: '3px 8px', borderBottom: '1px solid #ccc', fontSize: '8pt' }} colSpan="5">{domain.domain_fit}</td></tr>
                      )}
                    </tbody>
                  </table>

                  {/* Commentary */}
                  {c.recruiter_commentary && (
                    <div style={{ padding: '5px 8px', borderTop: '1px solid #ccc', fontSize: '8pt', lineHeight: '1.4' }}>
                      <strong>Commentary:</strong> {c.recruiter_commentary}
                    </div>
                  )}

                  {/* Interview Questions */}
                  {c.recommended_interview_questions?.length > 0 && (
                    <div style={{ padding: '5px 8px', borderTop: '1px solid #ccc', background: '#f9f9f9' }}>
                      <div style={{ fontSize: '7pt', fontWeight: '600', marginBottom: '3px' }}>Recommended Interview Questions:</div>
                      <ol style={{ fontSize: '8pt', paddingLeft: '16px', margin: '0' }}>{c.recommended_interview_questions.map((q, j) => (<li key={j} style={{ marginBottom: '2px', lineHeight: '1.4' }}>{q}</li>))}</ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== SECTION 4: REJECTED CANDIDATES ===== */}
        {rejected.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: '700', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>4. Rejected Candidates ({rejected.length})</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
              <thead>
                <tr>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'center', width: '4%' }}>#</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'left', width: '18%' }}>Candidate</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'center', width: '7%' }}>Score</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'center', width: '8%' }}>Tier</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'center', width: '7%' }}>Skills</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'center', width: '7%' }}>Exp</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'center', width: '7%' }}>Edu</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'center', width: '7%' }}>Soft</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'center', width: '7%' }}>Growth</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'left', width: '18%' }}>Missing Skills</th>
                  <th style={{ fontSize: '7pt', fontWeight: '600', padding: '4px 6px', borderBottom: '1px solid #000', background: '#f0f0f0', textAlign: 'left' }}>Reason</th>
                </tr>
              </thead>
              <tbody>{rejected.map((c, i) => {
                const details = c.matching_details || {};
                const skills = c.skills_analysis || {};
                return (
                  <tr key={c.cv_id || i} style={{ pageBreakInside: 'avoid' }}>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '8pt', textAlign: 'center' }}>{i + 1}</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '8pt' }}><div style={{ fontWeight: '600' }}>{c.candidate_name || 'Unknown'}</div><div style={{ fontSize: '6.5pt', color: '#666' }}>{c.filename || ''}</div></td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '10pt', fontWeight: '700', textAlign: 'center' }}>{details.overall_score || 0}%</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '7pt', textAlign: 'center', textTransform: 'capitalize' }}>{details.tier || 'N/A'}</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center' }}>{details.breakdown?.skills_score || 0}%</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center' }}>{details.breakdown?.experience_score || 0}%</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center' }}>{details.breakdown?.education_score || 0}%</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center' }}>{details.breakdown?.soft_skills_score || 0}%</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '8pt', fontWeight: '600', textAlign: 'center' }}>{details.breakdown?.growth_score || 0}%</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '7pt', lineHeight: '1.3' }}>{skills.required_missing?.slice(0, 4).join(', ') || 'N/A'}</td>
                    <td style={{ padding: '3px 6px', borderBottom: '1px solid #ccc', fontSize: '7pt', color: '#444', lineHeight: '1.3' }}>{c.rejection_reason || c.reason || 'N/A'}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}

        {/* ===== SECTION 5: SESSION NOTES ===== */}
        {sessionNote && (
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: '700', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{approved.length > 0 && rejected.length > 0 ? '5' : approved.length > 0 || rejected.length > 0 ? '4' : '3'}. Session Notes</h2>
            <div style={{ padding: '6px 10px', border: '1px solid #ccc', fontSize: '8.5pt', lineHeight: '1.4' }}>{sessionNote}</div>
          </div>
        )}

        {/* ===== SECTION 6: RECOMMENDATIONS ===== */}
        {session.hiring_recommendations?.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: '700', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{sessionNote ? '6' : approved.length > 0 && rejected.length > 0 ? '5' : '4'}. Hiring Recommendations</h2>
            <ol style={{ paddingLeft: '18px', margin: '4px 0' }}>{session.hiring_recommendations.map((rec, i) => (<li key={i} style={{ fontSize: '8.5pt', marginBottom: '4px', lineHeight: '1.4' }}>{rec}</li>))}</ol>
          </div>
        )}

        {/* ===== SIGNATURE & FOOTER ===== */}
        <div style={{ borderTop: '2px solid #000', paddingTop: '12px', marginTop: '20px', pageBreakInside: 'avoid' }}>
          <div style={{ display: 'flex', gap: '60px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ borderBottom: '1px solid #000', height: '30px', marginBottom: '4px' }}></div>
              <div style={{ fontSize: '8pt', fontWeight: '600' }}>Recruiter</div>
              <div style={{ fontSize: '7pt', color: '#555' }}>Date: _______________</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ borderBottom: '1px solid #000', height: '30px', marginBottom: '4px' }}></div>
              <div style={{ fontSize: '8pt', fontWeight: '600' }}>Hiring Manager</div>
              <div style={{ fontSize: '7pt', color: '#555' }}>Date: _______________</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ====== UPLOAD TAB ======
const UploadTab = ({ files, jobTitle, setJobTitle, numberOfPositions, setNumberOfPositions, jobRequirements, setJobRequirements, isLoading, error, setError, handleSubmit, isDragActive, getRootProps, getInputProps, removeFile }) => (
  <div className="grid lg:grid-cols-3 gap-6">
    <div className="lg:col-span-1">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Briefcase size={18} className="text-gray-700" /> Job Setup</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label><input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g., Senior Developer" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Positions <span className="text-red-500">*</span></label><input type="number" min="1" max="100" value={numberOfPositions} onChange={(e) => setNumberOfPositions(parseInt(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Requirements <span className="text-red-500">*</span></label><textarea value={jobRequirements} onChange={(e) => setJobRequirements(e.target.value)} placeholder="Describe the role, required skills..." rows={6} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none" required /></div>
        </div>
      </div>
    </div>
    <div className="lg:col-span-2">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Upload size={18} className="text-gray-700" /> Upload CVs</h2>
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer mb-4 ${isDragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}>
          <input {...getInputProps()} />
          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          {isDragActive ? <p className="text-gray-900 font-medium">Drop files here...</p> : (<><p className="text-gray-600 text-sm mb-1"><span className="text-gray-900 font-medium">Click to upload</span> or drag and drop</p><p className="text-xs text-gray-400">PDF files only</p></>)}
        </div>
        {files.length > 0 && (<div className="space-y-2 mb-4">{files.map((file, index) => (<div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"><div className="flex items-center gap-3"><FileText className="text-gray-600" size={18} /><div><p className="text-sm font-medium text-gray-900">{file.name}</p><p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div><button onClick={() => removeFile(index)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button></div>))}</div>)}
        {error && (<div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2"><AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} /><p className="text-red-700 text-sm">{error}</p></div>)}
        {isLoading ? (<div className="py-4"><PencilLoading text="Analyzing CVs..." /><div className="mt-3 space-y-2"><PencilProgressBar progress={30} label="Parsing..." /><PencilProgressBar progress={15} label="Extracting skills..." /></div></div>) : (<button onClick={handleSubmit} disabled={files.length === 0} className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm ${files.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}><Users size={16} /> Analyze {files.length} CV{files.length !== 1 ? 's' : ''}</button>)}
      </div>
    </div>
  </div>
);

export default RecruiterDashboard;
