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
  X
} from 'lucide-react';

interface ProfileField {
  label: string;
  value: string;
  icon: React.ReactNode;
  key: string;
  type?: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'notifications'>('info');

  const [formData, setFormData] = useState({
    fullName: 'Dr. Mohamed Ashraf',
    email: 'dr.mohamed@university.edu',
    phone: '+20 101 234 5678',
    interests: 'Data Structures, Algorithms, AI-Assisted Evaluation',
    joinDate: 'September 2019',
    bio: 'Senior lecturer with over 10 years of experience in computer science education. Specializing in algorithms, data structures, and AI-assisted evaluation systems.',
  });

  const [editData, setEditData] = useState({ ...formData });

  const handleSave = () => {
    setFormData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...formData });
    setIsEditing(false);
  };

  const STATS = [
    { label: 'Total Exams',      value: '25'  },
    { label: 'Students Graded', value: '250' },
    { label: 'Evaluations Done',value: '126' },
  ];

  const TABS = [
    { key: 'info',          label: 'Personal Info',   icon: <User size={16} /> },
    { key: 'security',      label: 'Security',        icon: <Shield size={16} /> },
    { key: 'notifications', label: 'Notifications',   icon: <Bell size={16} /> },
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
                  <span className="text-3xl font-bold text-primary">DR</span>
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-primary-hover transition-colors">
                  <Camera size={14} className="text-white" strokeWidth={2.5} />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-bold text-text-primary">{formData.fullName}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
                <p className="text-text-muted font-semibold mt-1 text-sm">{formData.interests}</p>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98] md:mb-2"
              >
                <Edit3 size={16} strokeWidth={2.5} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3 md:mb-2">
                <button onClick={handleCancel} className="flex items-center gap-2 bg-bg-input hover:bg-gray-100 text-text-secondary px-5 py-2.5 rounded-xl font-bold transition-all">
                  <X size={16} strokeWidth={2.5} /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 bg-success hover:bg-success/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all">
                  <Save size={16} strokeWidth={2.5} /> Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/40">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-muted font-semibold mt-1">{stat.label}</p>
              </div>
            ))}
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

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Phone size={13} /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                  />
                ) : (
                  <p className="font-bold text-text-primary py-3.5 px-4 bg-bg-surface/50 rounded-xl">{formData.phone}</p>
                )}
              </div>

              {/* Areas of Interest */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BookOpen size={13} /> Areas of Interest
                </label>
                {isEditing ? (
                  <input
                    value={editData.interests}
                    onChange={(e) => setEditData({ ...editData, interests: e.target.value })}
                    className="w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                  />
                ) : (
                  <p className="font-bold text-text-primary py-3.5 px-4 bg-bg-surface/50 rounded-xl">{formData.interests}</p>
                )}
              </div>

              {/* Join Date — read only */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar size={13} /> Member Since
                </label>
                <p className="font-bold text-text-primary py-3.5 px-4 bg-bg-surface/50 rounded-xl">{formData.joinDate}</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={4}
                  className="w-full bg-bg-input font-medium text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all resize-none"
                />
              ) : (
                <p className="text-text-secondary font-medium py-3.5 px-4 bg-bg-surface/50 rounded-xl leading-relaxed">{formData.bio}</p>
              )}
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

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Key size={13} /> Current Password
                </label>
                <input type="password" placeholder="••••••••" className="w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Key size={13} /> New Password
                </label>
                <input type="password" placeholder="••••••••" className="w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Key size={13} /> Confirm New Password
                </label>
                <input type="password" placeholder="••••••••" className="w-full bg-bg-input font-semibold text-text-primary rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all" />
              </div>
              <button className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98] mt-2">
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* ── Tab: Notifications ── */}
        {activeTab === 'notifications' && (
          <div className="p-8 md:p-12 space-y-5 animate-fade-in">
            {[
              { label: 'Evaluation Completed',    sub: 'Notify me when an AI evaluation finishes',     on: true  },
              { label: 'New Student Submission',  sub: 'Alert when a student submits their paper',      on: true  },
              { label: 'System Maintenance',      sub: 'Updates on server downtime or maintenance',     on: false },
              { label: 'Weekly Report Summary',   sub: 'Receive a weekly digest of evaluation stats',  on: true  },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-bg-surface/60 rounded-2xl border border-border/40">
                <div>
                  <p className="font-bold text-text-primary text-sm">{item.label}</p>
                  <p className="text-xs text-text-muted font-medium mt-0.5">{item.sub}</p>
                </div>
                {/* Toggle */}
                <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer flex-shrink-0 ${item.on ? 'bg-primary' : 'bg-border'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${item.on ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
