import { useState, useCallback, useEffect } from 'react';
import { analyzeCV, getCVs, getCVById, deleteCV } from '../services/api';
import { handleApiError } from '../utils/apiHelpers';
import { validateFile } from '../utils/validators';

export const useCVAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [cvs, setCVs] = useState([]);

  const analyze = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      setLoading(false);
      return null;
    }

    try {
      const response = await analyzeCV(file);
      setResult(response.data);
      return response.data;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCVs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCVs();
      setCVs(response.cvs || []);
      return response.cvs;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCVById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCVById(id);
      return response.cv;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCV = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteCV(id);
      setCVs(prev => prev.filter(cv => cv.id !== id));
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
    cvs,
    analyze,
    fetchCVs,
    fetchCVById,
    removeCV,
    clearError
  };
};
