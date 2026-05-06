import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button, Input, Alert } from '../components/ui';

export default function Login() {
  const { login, loading, error, clearError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlRole = searchParams.get('role');
  const defaultRole = urlRole === 'recruiter' ? 'recruiter' : 'candidate';
  
  const [loginRole, setLoginRole] = useState(defaultRole);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await login(formData);
    if (result.success) {
      if (result.user.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">{t('login')}</h1>
          <p className="text-gray-600">{t('signIn')}</p>
        </div>

        <div className="bg-white rounded-lg border border-warm-200 shadow-sm p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am signing in as:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoginRole('candidate')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-center transition-all ${
                  loginRole === 'candidate'
                    ? 'border-navy-900 bg-navy-50 text-navy-900'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Upload size={18} />
                <span className="font-medium">Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginRole('recruiter')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-center transition-all ${
                  loginRole === 'recruiter'
                    ? 'border-navy-900 bg-navy-50 text-navy-900'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Users size={18} />
                <span className="font-medium">Recruiter</span>
              </button>
            </div>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={clearError} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
              placeholder="you@example.com"
            />

            <Input
              label={t('password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {t('signIn')} {loginRole === 'recruiter' ? 'Recruiter' : 'Candidate'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600">
              {t('noAccount')}{' '}
              <Link to="/register" className="text-navy-900 font-medium hover:underline">
                {t('createAccount')}
              </Link>
            </p>
            <p>
              <Link to="/forgot-password" className="text-sm text-navy-800 hover:underline font-medium">
                {t('forgotPassword')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
