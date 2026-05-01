import React from 'react';
import { FileUp } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Reports</h2>
          <p className="text-text-muted mt-2 font-medium">Evaluation status and detailed reports will exist here.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-strong flex flex-col items-center justify-center min-h-[500px] text-center p-12">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
          <FileUp size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3">Reports Structure Coming Soon</h3>
        <p className="text-text-muted font-medium max-w-md mx-auto">This page is currently under construction. It will soon house the global evaluation statuses, generated PDF report downloads, and advanced analytic breakdowns.</p>
      </div>
    </div>
  );
};

export default Reports;
