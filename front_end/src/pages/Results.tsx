import React from 'react';

const Results: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Evaluation Results</h1>
      <p className="text-text-secondary">Review automatically graded results, manually adjust if necessary, and export them.</p>
      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden shadow-light mt-6">
        <table className="w-full text-left">
          <thead className="bg-bg-input">
            <tr>
              <th className="p-4 border-b border-border font-medium">Question</th>
              <th className="p-4 border-b border-border font-medium">Student Answer (OCR)</th>
              <th className="p-4 border-b border-border font-medium">Grade</th>
              <th className="p-4 border-b border-border font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-border text-text-secondary" colSpan={4}>No results loaded.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
