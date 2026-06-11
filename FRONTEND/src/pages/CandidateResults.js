import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, AlertCircle, ArrowLeft, Download, RefreshCw,
  TrendingUp, Award, Star, AlertTriangle, Brain, FileText, ChevronRight, 
  Zap, Lightbulb, User, Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, Target, ArrowUpRight,
  BarChart3, Languages, Code, Globe, Loader2
} from 'lucide-react';
import { PencilLoading, PencilProgressBar } from '../components/PencilDesigns';
import '../components/PencilDesigns.css';

const CandidateResults = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (location.state?.result) { setResult(location.state.result); setLoading(false); }
    else if (location.state?.cv?.parsed_data) { setResult(location.state.cv.parsed_data); setLoading(false); }
    else { setError('No analysis results found. Please upload your CV first.'); setLoading(false); }
  }, [location.state]);

  if (loading) return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PencilLoading text="Our AI is analyzing your CV..." />
      <div className="mt-8 max-w-md mx-auto"><PencilProgressBar progress={45} label="Extracting skills and experience..." /></div>
    </div>
  );

  if (error || !result) return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <AlertCircle className="mx-auto h-16 w-16 text-orange-500 mb-4" />
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-4">No Analysis Results</h1>
      <p className="text-gray-600 mb-6">{error || 'Please upload your CV to see the analysis.'}</p>
      <Link to="/candidate" className="inline-flex items-center gap-2 bg-navy-800 text-white px-6 py-3 rounded-sm hover:bg-navy-900 transition-all"><ArrowLeft size={18} /> Upload Your CV</Link>
    </div>
  );

  const candidateInfo = result.candidate_info || {};
  const skills = result.skills || [];
  const experience = result.experience_years || 0;
  const summary = result.summary || '';
  const analysis = result.analysis || {};
  const report = result.report || {};
  const skillGap = result.skill_gap || null;
  const workExperience = result.work_experience || [];
  const education = result.education || [];
  const certifications = result.certifications || [];
  const languages = result.languages || [];
  const projects = result.projects || [];
  
  const sectionRatings = analysis?.section_ratings || {};
  const overallScore = analysis?.overall_score || 0;
  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const recommendations = analysis?.improvement_tips || report?.english?.recommendations || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-indigo-600';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-blue-700';
    if (score >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const coachingReport = result.coaching_report || null;
  const actionPlan = coachingReport?.action_plan || [];
  const atsScore = coachingReport?.ats_score || 0;
  const atsIssues = coachingReport?.ats_issues || [];
  const keywordTips = coachingReport?.keyword_tips || [];
  const motivationalClosing = coachingReport?.motivational_closing || '';
  const overallAssessment = coachingReport?.overall_assessment || '';
  const keyStrengths = coachingReport?.key_strengths || [];
  const executiveSummary = report?.english?.executive_summary || '';
  const detailedFeedback = report?.english?.detailed_feedback || '';

  const sectionScores = [
    { label: 'Contact Info', score: sectionRatings?.contact_info?.score || 0, comment: sectionRatings?.contact_info?.comment || '', icon: User },
    { label: 'Summary', score: sectionRatings?.summary?.score || 0, comment: sectionRatings?.summary?.comment || '', icon: FileText },
    { label: 'Skills', score: sectionRatings?.skills?.score || 0, comment: sectionRatings?.skills?.comment || '', icon: Brain },
    { label: 'Experience', score: sectionRatings?.experience?.score || 0, comment: sectionRatings?.experience?.comment || '', icon: Briefcase },
    { label: 'Education', score: sectionRatings?.education?.score || 0, comment: sectionRatings?.education?.comment || '', icon: GraduationCap },
    { label: 'Certifications', score: sectionRatings?.certifications?.score || 0, comment: sectionRatings?.certifications?.comment || '', icon: Award },
    { label: 'Languages', score: sectionRatings?.languages?.score || 0, comment: sectionRatings?.languages?.comment || '', icon: Languages },
    { label: 'Projects', score: sectionRatings?.projects?.score || 0, comment: sectionRatings?.projects?.comment || '', icon: Code },
  ];

  const exportPDF = async () => {
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('candidate-report');
      const opt = {
        margin:       0.5,
        filename:     `Hirevion-CV-Report-${candidateInfo.name || 'candidate'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-8 no-print">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/candidate/dashboard" className="hover:text-navy-800 transition-colors">My CVs</Link>
          <ChevronRight size={14} />
          <span className="text-navy-800 font-medium">Analysis Results</span>
        </div>
        <div className="flex gap-3">
          <button onClick={exportPDF} disabled={exporting} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-navy-800 to-navy-900 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium disabled:opacity-50">
            {exporting ? <><Loader2 className="animate-spin" size={16} /> Generating...</> : <><Download size={16} /> Export PDF Report</>}
          </button>
          <Link to={location.state?.fromTryFree ? '/try-free' : '/candidate'} className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-warm-200 rounded-xl hover:border-navy-300 transition-all text-sm font-medium text-gray-700">
            <RefreshCw size={16} /> New Analysis
          </Link>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-6" id="candidate-report">
        {/* Hero Score Card */}
        <div className={`relative overflow-hidden rounded-2xl border-2 ${getScoreBg(overallScore)} p-8 hero-card`}>
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreGradient(overallScore)} flex items-center justify-center shadow-lg`}>
                <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center hero-score">
                  <span className={`text-4xl font-bold ${getScoreText(overallScore)}`}>{overallScore}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Score</span>
                </div>
              </div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getScoreGradient(overallScore)} shadow-md`}>
                {getScoreLabel(overallScore)}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left hero-info">
              <h1 className="text-3xl font-bold text-navy-900 mb-1">{candidateInfo.name || 'Your CV Analysis'}</h1>
              {overallAssessment && <p className="text-gray-700 mb-2 italic">{overallAssessment}</p>}
              <p className="text-gray-600 mb-4">{summary || 'AI-powered assessment of your professional profile'}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start hero-tags">
                {candidateInfo.email && <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/80 px-3 py-1.5 rounded-lg"><Mail size={14} />{candidateInfo.email}</span>}
                {candidateInfo.phone && <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/80 px-3 py-1.5 rounded-lg"><Phone size={14} />{candidateInfo.phone}</span>}
                {candidateInfo.address && <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/80 px-3 py-1.5 rounded-lg"><MapPin size={14} />{candidateInfo.address}</span>}
                {candidateInfo.linkedin && <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/80 px-3 py-1.5 rounded-lg"><Linkedin size={14} />LinkedIn</span>}
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/80 px-3 py-1.5 rounded-lg"><Briefcase size={14} />{experience} years exp</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/80 px-3 py-1.5 rounded-lg"><Brain size={14} />{skills.length} skills</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        {executiveSummary && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2"><FileText size={20} className="text-navy-700" /> Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed">{executiveSummary}</p>
          </div>
        )}

        {/* Detailed Feedback */}
        {detailedFeedback && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2"><FileText size={20} className="text-navy-700" /> Detailed Feedback</h2>
            <p className="text-gray-700 leading-relaxed">{detailedFeedback}</p>
          </div>
        )}

        {/* 1. Section Breakdown */}
        <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><BarChart3 size={20} className="text-navy-700" /> 1. Section Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectionScores.map((section, idx) => (
              <div key={idx} className={`text-center p-4 rounded-xl border ${getScoreBg(section.score)} hover:shadow-md transition-shadow score-item`}>
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <section.icon size={18} className={getScoreText(section.score)} />
                </div>
                <div className={`text-2xl font-bold ${getScoreText(section.score)}`}>{section.score}%</div>
                <div className="text-xs font-medium text-gray-700 mt-1 label">{section.label}</div>
                {section.comment && <div className="text-xs text-gray-500 mt-1">{section.comment}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Skills Detected */}
        {skills.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Brain size={20} className="text-purple-600" /> 2. Skills Detected ({skills.length})</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-navy-50 to-purple-50 text-navy-800 text-sm rounded-xl border border-navy-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* 3. Work Experience */}
        {workExperience.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Briefcase size={20} className="text-blue-600" /> 3. Work Experience</h2>
            <div className="space-y-4">
              {workExperience.map((exp, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-navy-200 transition-colors experience-item">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 exp-icon"><Briefcase size={18} className="text-blue-600" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy-900 exp-title">{exp.title || 'Position'}</h3>
                    <p className="text-sm text-gray-600 exp-company">{exp.company || ''} {exp.duration ? `• ${exp.duration}` : ''}</p>
                    {exp.description && <p className="text-sm text-gray-700 mt-2">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Education */}
        {education.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><GraduationCap size={20} className="text-purple-600" /> 4. Education</h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 education-item">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"><GraduationCap size={18} className="text-purple-600" /></div>
                  <div><h3 className="font-bold text-navy-900">{edu.degree || 'Degree'}</h3><p className="text-sm text-gray-600">{edu.institution || ''} {edu.year ? `• ${edu.year}` : ''}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Certifications */}
        {certifications.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Award size={20} className="text-yellow-600" /> 5. Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <Award size={16} className="text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Languages */}
        {languages.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Globe size={20} className="text-green-600" /> 6. Languages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <Globe size={16} className="text-green-600" />
                  <div><span className="text-sm font-medium text-gray-900">{lang.language}</span><span className="text-xs text-gray-500 block">{lang.level}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Projects */}
        {projects.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Code size={20} className="text-indigo-600" /> 7. Projects</h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <h3 className="font-bold text-navy-900">{proj.name || 'Project'}</h3>
                  {proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((t, j) => (<span key={j} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded skill-tag">{t}</span>))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          {strengths.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6 strengths-box">
              <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2"><CheckCircle size={20} /> 8. Strengths</h2>
              <ul className="space-y-3">
                {strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white/70 p-3 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-green-700 text-xs font-bold">{idx + 1}</span></div>
                    <span className="text-green-900 text-sm">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 p-6 weaknesses-box">
              <h2 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2"><AlertTriangle size={20} /> 9. Areas to Improve</h2>
              <ul className="space-y-3">
                {weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white/70 p-3 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-orange-700 text-xs font-bold">{idx + 1}</span></div>
                    <span className="text-orange-900 text-sm">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 10. Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-gradient-to-br from-navy-50 to-indigo-50 rounded-2xl border-2 border-navy-200 p-6 section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Lightbulb size={20} className="text-yellow-500" /> 10. AI Recommendations</h2>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white/80 p-3 rounded-xl">
                  <Zap size={18} className="text-navy-600 flex-shrink-0 mt-0.5" />
                  <span className="text-navy-900 text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Strengths from Coaching Report */}
        {keyStrengths.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Star size={20} className="text-yellow-500" /> Key Strengths</h2>
            <div className="space-y-2">
              {keyStrengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                  <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-yellow-700 text-xs font-bold">{idx + 1}</span></div>
                  <span className="text-yellow-900 text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. Your Action Plan */}
        {actionPlan.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Target size={20} className="text-red-600" /> 11. Your Action Plan</h2>
            <div className="space-y-3">
              {actionPlan.map((item, idx) => (
                <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border ${item.priority === 'HIGH' ? 'bg-red-50 border-red-200' : item.priority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'} action-item`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.priority === 'HIGH' ? 'bg-red-200' : item.priority === 'MEDIUM' ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.priority === 'HIGH' ? 'bg-red-200 text-red-800' : item.priority === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>{item.priority}</span>
                      <span className="font-bold text-navy-900">{item.action}</span>
                    </div>
                    <p className="text-sm text-green-700">→ {item.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. ATS Compatibility */}
        <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card ats-box">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2"><Code size={20} className="text-indigo-600" /> 12. ATS Compatibility</h2>
          <div className="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">ATS Score</span>
              <span className={`text-2xl font-bold ats-score ${atsScore >= 80 ? 'text-green-700' : atsScore >= 60 ? 'text-yellow-700' : 'text-red-700'}`}>{atsScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${atsScore}%` }}></div>
            </div>
          </div>
          {atsIssues.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-red-700 mb-2">⚠️ Formatting Issues:</p>
              <ul className="space-y-1">{atsIssues.map((issue, i) => (<li key={i} className="text-sm text-gray-700 flex items-start gap-2"><AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />{issue}</li>))}</ul>
            </div>
          )}
          {keywordTips.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-700 mb-2">✅ Keyword Tips:</p>
              <ul className="space-y-1">{keywordTips.map((tip, i) => (<li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />{tip}</li>))}</ul>
            </div>
          )}
        </div>

        {/* 13. Skills to Develop */}
        {skillGap && skillGap.recommendations?.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm section-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2"><TrendingUp size={20} className="text-green-600" /> 13. Skills to Develop</h2>
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">{skillGap.domain}</span>
            </div>
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-700">Current Score</span><span className="text-sm font-medium text-gray-700">Target Score</span></div>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${getScoreText(skillGap.current_score)}`}>{skillGap.current_score}%</span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${getScoreGradient(skillGap.current_score)} rounded-full`} style={{ width: `${skillGap.current_score}%` }}></div></div>
                <ArrowUpRight size={20} className="text-green-600" />
                <span className="text-2xl font-bold text-green-700">{skillGap.target_score}%</span>
              </div>
            </div>
            <div className="space-y-3">
              {skillGap.recommendations.slice(0, 6).map((rec, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${rec.priority === 'ESSENTIAL' ? 'bg-green-50 border-green-200' : rec.priority === 'HIGH_VALUE' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} skill-gap-item`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rec.priority === 'ESSENTIAL' ? 'bg-green-200' : rec.priority === 'HIGH_VALUE' ? 'bg-blue-200' : 'bg-gray-200'}`}><span className="text-xs font-bold">{idx + 1}</span></div>
                    <div><span className="font-bold text-navy-900">{rec.skill}</span><p className="text-xs text-gray-500">{rec.why}</p></div>
                  </div>
                  <div className="text-right"><span className="text-sm font-bold text-green-700">+{rec.impact_points} pts</span><p className="text-xs text-gray-400">{rec.estimated_hours}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. Motivational Closing */}
        {motivationalClosing && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6 text-center section-card">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-200 flex items-center justify-center"><Star size={24} className="text-green-700" /></div>
            <h2 className="text-lg font-bold text-green-800 mb-3">A Note for You</h2>
            <p className="text-green-900 text-base italic leading-relaxed max-w-2xl mx-auto">{motivationalClosing}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200 footer no-print">
          <p className="text-xs text-gray-400">Generated by Hirevion — {formatDate(new Date().toISOString())}</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateResults;
