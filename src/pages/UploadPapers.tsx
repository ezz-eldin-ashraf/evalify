import React from 'react';

const UploadPapers: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload Student Papers</h1>
      <p className="text-text-secondary">Upload student answer sheets to be graded automatically against the template.</p>
      <div className="p-8 border-2 border-dashed border-border rounded-lg bg-bg-surface flex items-center justify-center text-text-muted text-center h-64">
        <div>
          <p className="mb-4">Drag and drop images here</p>
          <button type="button" className="py-2 px-4 bg-primary text-white rounded hover:bg-primary-hover transition-colors">Select Files</button>
        </div>
      </div>
    </div>
  );
};

export default UploadPapers;
