import React from 'react';

const TemplateCreator: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Template</h1>
      <p className="text-text-secondary">Upload an exam template image and define the bounding boxes for answers.</p>
      <div className="p-8 border-2 border-dashed border-border rounded-lg bg-bg-surface flex items-center justify-center text-text-muted text-center h-64">
        <div>
          <p className="mb-4">Drag and drop an image here</p>
          <button type="button" className="py-2 px-4 bg-secondary text-white rounded hover:bg-secondary-hover transition-colors">Select File</button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreator;
