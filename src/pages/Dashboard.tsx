import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  PlayCircle,
  MoreVertical,
  Plus,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

// --- Mock Data ---
const STATS = [
  { id: 1, label: 'Total Exams', value: '25', icon: <FileText size={22} className="text-primary" /> },
  { id: 2, label: 'Total Students', value: '250', icon: <Users size={22} className="text-secondary" /> },
  { id: 3, label: 'Evaluation Done', value: '126', icon: <CheckCircle2 size={22} className="text-success" /> },
  { id: 4, label: 'Pending Review', value: '5', icon: <Clock size={22} className="text-warning" /> },
];

interface Template {
  templateId: number;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/templates');
        setTemplates(response.data);
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Welcome back, {user?.fullName || 'User'} 👋</h2>
          <p className="text-text-muted mt-1 font-medium">Here is what's happening with your evaluations today.</p>
        </div>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <Link to="/upload-template">
            <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <Plus size={18} strokeWidth={2.5} />
              Create New Exam
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-[2rem] shadow-strong flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
            <div className="p-4 bg-bg-surface rounded-2xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary leading-tight">{stat.value}</p>
              <h3 className="text-text-muted font-bold text-sm mt-0.5">{stat.label}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Synthesis Card: Table (Left) + Robot (Right) */}
      <div className="bg-white rounded-[2.5rem] shadow-strong overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
        
        {/* Left Column: Data Table */}
        <div className="w-full lg:w-[60%] p-8 lg:p-10 flex flex-col">
          <h3 className="text-xl font-bold text-text-primary mb-6">My Saved Exams (Templates)</h3>
          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-text-muted font-medium">Loading templates...</div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-text-muted font-medium">
                No exams saved yet. Create a new exam template to get started!
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-text-muted text-xs uppercase tracking-wider">
                    <th className="pb-4 font-bold">Exam Name</th>
                    <th className="pb-4 font-bold">Created At</th>
                    <th className="pb-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {templates.map((template) => (
                    <tr key={template.templateId} className="hover:bg-bg-surface/50 transition-colors group">
                      <td className="py-4 pr-4 text-sm font-bold text-text-primary">{template.name}</td>
                      <td className="py-4 pr-4 text-sm font-medium text-text-secondary">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-center flex justify-center gap-2">
                        {/* Currently redirecting to a generic path, to be implemented if needed */}
                        <Link to={`/edit-template/${template.templateId}`}>
                          <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Edit Template">
                            <Settings size={18} />
                          </button>
                        </Link>
                        <Link to={`/evaluate?templateId=${template.templateId}`}>
                          <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Evaluate Papers">
                            <PlayCircle size={18} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Embedded Robot */}
        <div className="w-full lg:w-[40%] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] p-8 flex items-center justify-center relative overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          
          <img 
            src="/images/robot2.png" 
            alt="AI Evaluation Robot" 
            className="w-full max-w-[320px] object-contain drop-shadow-2xl animate-fade-in hover:-translate-y-2 transition-transform duration-700"
          />
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
