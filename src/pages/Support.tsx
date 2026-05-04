import React from 'react';
import {
  UploadCloud,
  PenTool,
  ClipboardCheck,
  Lock,
  Paperclip,
  Send,
  Server,
  Cpu,
  Database
} from 'lucide-react';

const CATEGORIES = [
  { id: 1, title: 'Upload Issues', subtitle: 'Problems with uploading papers', icon: <UploadCloud size={24} /> },
  { id: 2, title: 'OCR Errors', subtitle: 'AI handwriting recognition', icon: <PenTool size={24} /> },
  { id: 3, title: 'Evaluation issue', subtitle: 'Incorrect grading logic', icon: <ClipboardCheck size={24} /> },
  { id: 4, title: 'Account & Login', subtitle: 'Password and access', icon: <Lock size={24} /> },
];

const SYSTEM_STATUS = [
  { id: 1, label: 'AI Server', status: 'Online', color: 'text-success', icon: <Server size={18} className="text-text-muted" /> },
  { id: 2, label: 'OCR Engine', status: 'Running', color: 'text-success', icon: <Cpu size={18} className="text-text-muted" /> },
  { id: 3, label: 'Database', status: 'Connected', color: 'text-success', icon: <Database size={18} className="text-text-muted" /> },
];

const Support: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up w-full">

      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary">Support & Help Center</h2>
        <p className="text-text-muted mt-2 font-medium">We're here to help you use Evalify efficiently</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-strong overflow-hidden flex flex-col">

        {/* Top Section: Categories */}
        <div className="p-8 lg:p-12 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map(category => (
              <div key={category.id} className="bg-white border border-border/40 hover:border-primary/30 p-6 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-bold text-text-primary mb-1">{category.title}</h3>
                <p className="text-xs text-text-muted font-medium">{category.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border/40"></div>

        {/* Bottom Section: 2 Columns */}
        <div className="flex flex-col lg:flex-row flex-1">

          {/* Left Column: Form */}
          <div className="w-full lg:w-[65%] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-border/40">
            <h3 className="text-xl font-bold text-text-primary mb-8">Contact Support</h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. Smith"
                    className="w-full bg-bg-input text-text-primary font-semibold rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-bg-input text-text-primary font-semibold rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Issue Type</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-bg-input text-text-primary font-semibold rounded-xl py-3.5 pl-4 pr-10 border border-transparent focus:border-primary/30 outline-none shadow-sm cursor-pointer transition-all">
                    <option>Select an issue category...</option>
                    <option>Template Mapping Error</option>
                    <option>OCR Grading Inaccuracy</option>
                    <option>Account Management</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Message</label>
                <textarea
                  placeholder="Describe your issue in detail..."
                  className="w-full h-32 bg-bg-input text-text-primary font-semibold rounded-xl p-4 border border-transparent focus:border-primary/30 outline-none shadow-sm resize-none transition-all"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 border border-border/60 p-3 rounded-xl bg-bg-surface">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Paperclip size={18} />
                    <span className="text-sm font-bold">Attach Screenshot</span>
                  </div>
                  <label className="bg-white border border-border/40 hover:bg-gray-50 text-text-primary px-4 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-sm">
                    Browse file
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>

                <button
                  type="button"
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Send size={18} />
                  Send Request
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: System Status */}
          <div className="w-full lg:w-[35%] bg-[#F8FAFC] p-8 lg:p-12">
            <h3 className="text-xl font-bold text-text-primary mb-8">System Status</h3>

            <div className="space-y-4">
              {SYSTEM_STATUS.map((sys) => (
                <div key={sys.id} className="bg-white p-5 rounded-[1.25rem] border border-border/40 shadow-sm flex flex-col hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {sys.icon}
                      </div>
                      <span className="font-bold text-text-primary">{sys.label}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-success/10 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                      <span className="text-xs font-bold text-success">{sys.status}</span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-border/40 my-1"></div>
                  <div className="mt-3 text-xs text-text-muted font-medium flex justify-between">
                    <span>Latency: &lt; 20ms</span>
                    <span>Last checked: Just now</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
              <p className="text-sm font-medium text-text-primary leading-relaxed">
                Need immediate emergency assistance?<br />
                <span className="text-primary font-bold block mt-2 text-lg">+1 (800) EVALIFY</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
