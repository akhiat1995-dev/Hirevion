import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { Button, Input, Alert } from '../components/ui';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { setError('Reset token is missing'); return; }
    if (!password) { setError('New password is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/reset-password', { token, password });
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>

        <div className="bg-white rounded-lg border border-warm-200 shadow-sm p-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!searchParams.get('token') && (
              <Input
                label="Reset Token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                placeholder="Paste your reset token here"
              />
            )}

            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter password"
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <Shield size={18} className="mr-2" /> Reset Password
            </Button>
          </form>

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle2 className="mx-auto text-green-600 mb-1" size={24} />
              <p className="text-sm text-green-800">Redirecting to login...</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-navy-900 font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
