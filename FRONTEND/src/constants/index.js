export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_UPLOAD = 10;

export const API_ENDPOINTS = {
  HEALTH: "/health",
  STATS: "/stats",
  CANDIDATE: {
    ANALYZE: "/candidate/analyze",
    LIST: "/candidate/list",
    GET: (id) => `/candidate/${id}`,
    DELETE: (id) => `/candidate/${id}`
  },
  RECRUITER: {
    HIRING: "/recruiter/hiring",
    APPLICATIONS: "/recruiter/applications",
    CLEAR_APPLICATIONS: "/recruiter/applications",
    JOBS: "/recruiter/jobs",
    GET_JOB: (id) => `/recruiter/jobs/${id}`,
    UPDATE_JOB: (id) => `/recruiter/jobs/${id}`,
    DELETE_JOB: (id) => `/recruiter/jobs/${id}`,
    SESSIONS: "/recruiter/sessions",
    GET_SESSION: (id) => `/recruiter/sessions/${id}`,
    DELETE_SESSION: (id) => `/recruiter/sessions/${id}`,
    CLEAR_SESSIONS: "/recruiter/sessions"
  }
};

export const ROUTES = {
  HOME: "/",
  RECRUITER: "/recruiter",
  CANDIDATE: "/candidate",
  CANDIDATE_RESULTS: "/candidate/results",
  JOB_SETUP: "/job-setup",
  RESULTS: "/results",
  TEST: "/test",
  DESIGNS: "/designs",
  SCROLL_DEMO: "/scroll-demo"
};

export const MATCH_TIERS = {
  excellent: { label: "Excellent", description: "Strong hire", color: "green", minScore: 80 },
  good: { label: "Good", description: "Hire with mentorship", color: "blue", minScore: 65 },
  potential: { label: "Potential", description: "Interview for potential", color: "yellow", minScore: 50 },
  not_suitable: { label: "Not Suitable", description: "Does not meet requirements", color: "red", minScore: 0 }
};

export const SCORING_WEIGHTS = {
  skills: { label: "Skills Match", weight: 40 },
  experience: { label: "Experience", weight: 25 },
  education: { label: "Education", weight: 15 },
  domain: { label: "Domain Fit", weight: 20 }
};

export const MESSAGES = {
  SUCCESS: {
    CV_ANALYZED: "CV analyzed successfully",
    SESSION_SAVED: "Hiring session saved",
    JOB_CREATED: "Job posting created",
    JOB_UPDATED: "Job posting updated",
    JOB_DELETED: "Job posting deleted",
    SESSION_DELETED: "Session deleted",
    APPLICATIONS_CLEARED: "All applications cleared"
  },
  ERROR: {
    CV_ANALYSIS_FAILED: "CV analysis failed. Please try again",
    CONNECTION_FAILED: "Cannot connect to server",
    INVALID_FILE: "Invalid file format or size",
    NO_FILES: "Please select at least one CV file",
    JOB_TITLE_REQUIRED: "Job title is required",
    JOB_REQUIREMENTS_REQUIRED: "Job requirements are required",
    POSITIONS_REQUIRED: "Number of positions must be at least 1"
  },
  LOADING: {
    ANALYZING_CV: "Analyzing your CV with AI...",
    PROCESSING_CVS: "Processing CVs...",
    MATCHING_CANDIDATES: "Matching candidates to job...",
    LOADING_DATA: "Loading data..."
  },
  PLACEHOLDER: {
    JOB_TITLE: "e.g., Senior Full Stack Developer",
    JOB_REQUIREMENTS: "Describe the required skills, experience, and qualifications...",
    POSITIONS: "Number of open positions"
  }
};
