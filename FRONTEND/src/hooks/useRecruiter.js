import { useState, useCallback } from 'react';
import { submitHiringWorkflow, getJobs, deleteJob, getHiringSessions, getHiringSession, deleteHiringSession } from '../services/api';
import { handleApiError } from '../utils/apiHelpers';
import { validateFiles, validateJobTitle, validateJobRequirements, validateNumber } from '../utils/validators';

export const useRecruiter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [sessions, setSessions] = useState([]);

  const submitHiring = useCallback(async (jobTitle, positions, requirements, files) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const titleValidation = validateJobTitle(jobTitle);
    if (!titleValidation.valid) {
      setError(titleValidation.error);
      setLoading(false);
      return null;
    }

    const positionsValidation = validateNumber(positions, 1, 100);
    if (!positionsValidation.valid) {
      setError(positionsValidation.error);
      setLoading(false);
      return null;
    }

    const requirementsValidation = validateJobRequirements(requirements);
    if (!requirementsValidation.valid) {
      setError(requirementsValidation.error);
      setLoading(false);
      return null;
    }

    const filesValidation = validateFiles(files);
    if (!filesValidation.valid) {
      setError(filesValidation.errors.join(', '));
      setLoading(false);
      return null;
    }

    try {
      const response = await submitHiringWorkflow({
        job_title: jobTitle,
        number_of_positions: parseInt(positions),
        job_requirements: requirements,
        cvs: files
      });
      setResult(response);
      return response;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getJobs();
      setJobs(response.jobs || []);
      return response.jobs;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const removeJob = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);

    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
      return true;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHiringSessions();
      setSessions(response.sessions || []);
      return response.sessions;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSession = useCallback(async (sessionId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHiringSession(sessionId);
      return response.session;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeSession = useCallback(async (sessionId) => {
    setLoading(true);
    setError(null);

    try {
      await deleteHiringSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      return true;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    result,
    jobs,
    sessions,
    submitHiring,
    fetchJobs,
    removeJob,
    fetchSessions,
    fetchSession,
    removeSession,
    clearError
  };
};
