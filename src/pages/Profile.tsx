import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Edit3,
  Camera,
  Shield,
  Key,
  Bell,
  CheckCircle2,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

interface ProfileField {
  label: string;
  value: string;
  icon: React.ReactNode;
  key: string;
  type?: string;
}

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const [editData, setEditData] = useState({ ...formData });

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least 1 uppercase letter.";
    if (!/[!@#$%^&*(),.?":{}|<>\-_]/.test(pwd)) return "Password must contain at least 1 symbol.";
    if (/(0123|1234|2345|3456|4567|5678|6789)/.test(pwd)) return "Password should not contain simple sequences like 1234.";
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    if (pwd.length > 0) {
      setPasswordError(validatePassword(pwd));
    } else {
      setPasswordError(null);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordSuccess(null);
    const error = validatePassword(newPassword);
    if (error) {
      setPasswordError(error);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setPasswordError(err.response.data.title || err.response.data.detail || "Failed to update password.");
      } else {
        setPasswordError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSave = async () => {
    setProfileError(null);
    setIsSavingProfile(true);
    try {
      const response = await api.put('/auth/profile', {
        fullName: editData.fullName,
        email: editData.email
      });
      
      // Update global context and local storage with new info and new token
      login(response.data);
      
      setFormData({ fullName: response.data.fullName, email: response.data.email });
      setIsEditing(false);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setProfileError(err.response.data.title || err.response.data.detail || "Failed to update profile.");
      } else {
        setProfileError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...formData });
    setProfileError(null);
    setIsEditing(false);
  };



  const TABS = [
    { key: 'info',          label: 'Personal Info',   icon: <User size={16} /> },
    { key: 'security',      label: 'Security',        icon: <Shield size={16} /> },
  ] as const;

  return (
    <div className="space-y-8 animate-fade-in-up w-full max-w-5xl mx-auto">

      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-text-primary">Teacher Profile</h2>
        <p className="text-text-muted mt-2 font-medium">Manage your personal information, security settings, and preferences.</p>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-[2.5rem] shadow-strong overflow-hidden">
        {/* Avatar + Name Row — no cover banner */}
        <div className="px-8 md:px-12 pt-10 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-primary uppercase">
                    {user?.fullName?.substring(0, 2) || 'U'}
                  </span>
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-primary-hover transition-colors">
                  <Camera size={14} className="text-white" strokeWidth={2.5} />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-bold text-text-primary">{user?.fullName}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing ? (
              <button
                onClick={() => {
                  setEditData({ ...formData });
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98] md:mb-2"
              >
                <Edit3 size={16} strokeWidth={2.5} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3 md:mb-2">
                <button onClick={handleCancel} disabled={isSavingProfile} className="flex items-center gap-2 bg-bg-input hover:bg-gray-100 disabled:opacity-50 text-text-secondary px-5 py-2.5 rounded-xl font-bold transition-all">
                  <X size={16} strokeWidth={2.5} /> Cancel
                </button>
                <button onClick={handleSave} disabled={isSavingProfile} className="flex items-center gap-2 bg-success hover:bg-success/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all">
                  <Save size={16} strokeWidth={2.5} /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>


        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-[2rem] shadow-strong overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border/40 px-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-5 text-sm font-bold border-b-2 transition-all duration-200 ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Personal Info ── */}
        {activeTab === 'info' && (
          <div className="p-8 md:p-12 space-y-6 animate-fade-in">
            {profileError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
                {profileError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User size={13} /> Full Name
                </label>
                {isEditing ? (
                  <input
                    value={editData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    className="w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                  />
                ) : (
                  <p className="font-bold text-text-primary py-3.5 px-4 bg-bg-surface/50 rounded-xl">{formData.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Mail size={13} /> Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                  />
                ) : (
                  <p className="font-bold text-text-primary py-3.5 px-4 bg-bg-surface/50 rounded-xl">{formData.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Security ── */}
        {activeTab === 'security' && (
          <div className="p-8 md:p-12 space-y-6 animate-fade-in">
            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-5 flex items-start gap-4">
              <Shield size={20} className="text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-warning text-sm">Security Recommendation</p>
                <p className="text-text-muted text-xs font-medium mt-1">We recommend changing your password every 90 days to keep your account secure.</p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm font-medium text-center">
                {passwordSuccess}
              </div>
            )}

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Key size={13} /> Current Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Key size={13} /> New Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border outline-none shadow-sm transition-all ${passwordError && newPassword ? 'border-error/50 focus:border-error' : 'border-transparent focus:border-primary/30'}`} 
                />
                {passwordError && newPassword.length > 0 && (
                  <p className="text-error text-xs font-bold mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> {passwordError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Key size={13} /> Confirm New Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value && e.target.value !== newPassword) {
                      setPasswordError("New passwords do not match.");
                    } else if (newPassword && !validatePassword(newPassword)) {
                      setPasswordError(null);
                    }
                  }}
                  className={`w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border outline-none shadow-sm transition-all ${confirmPassword && confirmPassword !== newPassword ? 'border-error/50 focus:border-error' : 'border-transparent focus:border-primary/30'}`} 
                />
              </div>
              <button 
                onClick={handleUpdatePassword}
                disabled={!!passwordError || !currentPassword || !newPassword || !confirmPassword || isUpdatingPassword}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98] mt-2"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
