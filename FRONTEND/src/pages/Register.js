import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert } from '../components/ui';

export default function Register() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'user'
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
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    else if (formData.full_name.trim().length < 2) errors.full_name = 'Name must be at least 2 characters';
    
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const { confirm_password, ...registerData } = formData;
    const result = await register(registerData);
    if (result.success) {
      if (result.user.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Choose your role and get started</p>
        </div>

        <div className="bg-white rounded-lg border border-warm-200 shadow-sm p-8">
          {/* Role Selector - First thing user sees */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I want to:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  formData.role === 'user'
                    ? 'border-navy-900 bg-navy-50 text-navy-900'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <Upload size={24} />
                </div>
                <div className="font-bold">Candidate</div>
                <div className="text-xs mt-1 text-gray-500">Analyze & improve my CV</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'recruiter' }))}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  formData.role === 'recruiter'
                    ? 'border-navy-900 bg-navy-50 text-navy-900'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <Users size={24} />
                </div>
                <div className="font-bold">Recruiter</div>
                <div className="text-xs mt-1 text-gray-500">Screen & hire candidates</div>
              </button>
            </div>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={clearError} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              error={formErrors.full_name}
              required
              placeholder="John Doe"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
              placeholder="Min. 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={formErrors.confirm_password}
              required
              placeholder="Re-enter password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Create {formData.role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-navy-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
