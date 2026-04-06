import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Trash2, Save, AlertTriangle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Button, Input, Alert } from '../components/ui';

export default function ProfileSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = { full_name: fullName };
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          setError('New password must be at least 6 characters');
          setLoading(false);
          return;
        }
        updateData.password = newPassword;
      }

      await api.put('/auth/me', updateData);
      setSuccess('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.email) {
      setError('Please type your email address to confirm deletion');
      return;
    }
    if (!currentPassword) {
      setError('Please enter your current password to confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.delete('/auth/me', { params: { confirm_password: currentPassword } });
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your profile, password, and account preferences.</p>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

      {/* Profile Info */}
      <div className="bg-white rounded-lg border border-warm-200 shadow-sm p-6 mb-6">
        <h2 className="font-serif text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
          <User size={20} /> Profile Information
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-warm-200 rounded-sm focus:ring-2 focus:ring-navy-800 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-warm-200 rounded-sm text-gray-500">
              <Mail size={16} />
              <span>{user?.email}</span>
              <span className="ml-auto text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full capitalize">{user?.role}</span>
            </div>
          </div>

          {/* Change Password */}
          <div className="pt-4 border-t border-warm-200">
            <h3 className="font-medium text-navy-900 mb-3 flex items-center gap-2">
              <Shield size={16} /> Change Password
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min. 6 characters)"
                  className="w-full px-4 py-2 pr-10 border border-warm-200 rounded-sm focus:ring-2 focus:ring-navy-800 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-warm-200 rounded-sm focus:ring-2 focus:ring-navy-800 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="flex items-center gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
        <h2 className="font-serif text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} /> Danger Zone
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Deleting your account is permanent. All your CVs, jobs, and hiring sessions will be removed.
        </p>

        <div className="space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            className="w-full px-4 py-2 border border-red-200 rounded-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={`Type "${user?.email}" to confirm`}
            className="w-full px-4 py-2 border border-red-200 rounded-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} /> Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
