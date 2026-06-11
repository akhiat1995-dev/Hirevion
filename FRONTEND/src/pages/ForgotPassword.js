import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Button, Input, Alert } from '../components/ui';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSuccess(response.data.message);
      if (response.data.reset_link) {
        setResetLink(response.data.reset_link);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">{t('forgotPasswordTitle')}</h1>
          <p className="text-gray-600">{t('forgotPasswordDesc')}</p>
        </div>

        <div className="bg-white rounded-lg border border-warm-200 shadow-sm p-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
              placeholder="you@example.com"
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <Mail size={18} className="mr-2" /> {t('resetPassword')}
            </Button>
          </form>

          {resetLink && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-1">Development Mode — Reset Link:</p>
              <a href={resetLink} className="text-sm text-blue-600 underline break-all">{resetLink}</a>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-navy-900 font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft size={16} /> {t('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
