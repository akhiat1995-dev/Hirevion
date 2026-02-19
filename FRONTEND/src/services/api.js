import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Recruiter API
export const submitHiringWorkflow = async (formData) => {
  try {
    const response = await api.post('/recruiter/hiring', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getApplications = async () => {
  try {
    const response = await api.get('/recruiter/applications');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearApplications = async () => {
  try {
    const response = await api.delete('/recruiter/applications');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobs = async () => {
  try {
    const response = await api.get('/recruiter/jobs');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJob = async (jobId) => {
  try {
    const response = await api.get(`/recruiter/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await api.put(`/recruiter/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await api.delete(`/recruiter/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHiringSessions = async () => {
  try {
    const response = await api.get('/recruiter/sessions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHiringSession = async (sessionId) => {
  try {
    const response = await api.get(`/recruiter/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteHiringSession = async (sessionId) => {
  try {
    const response = await api.delete(`/recruiter/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearHiringSessions = async () => {
  try {
    const response = await api.delete('/recruiter/sessions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Candidate API
export const analyzeCV = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/candidate/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCVs = async () => {
  try {
    const response = await api.get('/candidate/list');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCVById = async (id) => {
  try {
    const response = await api.get(`/candidate/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCV = async (id) => {
  try {
    const response = await api.delete(`/candidate/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
