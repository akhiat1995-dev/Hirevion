import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
export const tryFreeAnalyze = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/candidate/try-free`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

// Auth API
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (refreshTokenValue) => {
  try {
    const response = await api.post('/auth/refresh', { refresh_token: refreshTokenValue });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export default api;
